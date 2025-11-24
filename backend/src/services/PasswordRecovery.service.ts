import { PrismaClient } from '@prisma/generated/client';
import { EmailService } from '@/services/Email.service';
import { AppError } from '@/utils/errors.util';
import { randomBytes } from 'crypto';
import { hash } from 'bcrypt';

export class PasswordRecoveryService {
	private readonly TOKEN_EXPIRATION_MINUTES = 5;
	private readonly SALT_ROUNDS = 10;

	constructor(
		private database: PrismaClient,
		private emailService: EmailService,
	) {}

	private generateToken(): string {
		return randomBytes(32).toString('hex');
	}

	private getTokenExpiration(): Date {
		const now = new Date();
		return new Date(now.getTime() + this.TOKEN_EXPIRATION_MINUTES * 60000);
	}

	async requestPasswordReset(email: string): Promise<void> {
		const user = await this.database.user.findUnique({
			where: { email: email.toLowerCase() },
			select: {
				id: true,
				email: true,
				first_name: true,
				last_name: true,
				is_active: true,
			},
		});

		if (!user) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});
		}

		if (!user.is_active) {
			throw new AppError({
				message: 'Usuário inativo',
				errorCode: 'INACTIVE',
			});
		}

		const token = this.generateToken();
		const expiresAt = this.getTokenExpiration();

		await this.database.user.update({
			where: { id: user.id },
			data: {
				reset_token: token,
				reset_token_expires: expiresAt,
			},
		});

		const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
		const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

		await this.emailService.sendPasswordResetEmail({
			to: user.email,
			userName: `${user.first_name} ${user.last_name}`,
			resetUrl,
			expirationMinutes: this.TOKEN_EXPIRATION_MINUTES,
		});
	}

	async validateToken(token: string): Promise<boolean> {
		const user = await this.database.user.findFirst({
			where: {
				reset_token: token,
			},
			select: {
				id: true,
				reset_token_expires: true,
			},
		});

		if (!user) {
			throw new AppError({
				message: 'Token inválido',
				errorCode: 'TOKEN_NOT_FOUND',
			});
		}

		const now = new Date();
		if (user.reset_token_expires && user.reset_token_expires < now) {
			throw new AppError({
				message: 'Token expirado',
				errorCode: 'TOKEN_EXPIRED',
			});
		}

		return true;
	}

	async resetPassword(token: string, newPassword: string): Promise<void> {
		await this.validateToken(token);

		const user = await this.database.user.findFirst({
			where: { reset_token: token },
			select: { id: true, email: true, first_name: true },
		});

		if (!user) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});
		}

		const hashedPassword = await hash(newPassword, this.SALT_ROUNDS);

		await this.database.user.update({
			where: { id: user.id },
			data: {
				password_hash: hashedPassword,
				reset_token: null,
				reset_token_expires: null,
			},
		});

		await this.emailService.sendPasswordChangedEmail({
			to: user.email,
			userName: user.first_name,
		});

		await this.database.auditLog.create({
			data: {
				user_id: user.id,
				action: 'UPDATE',
				entity: 'User',
				entity_id: user.id,
				old_value: { event: 'password_reset_requested' },
				new_value: { event: 'password_reset_completed' },
			},
		});
	}

	async cleanExpiredTokens(): Promise<number> {
		const now = new Date();

		const result = await this.database.user.updateMany({
			where: {
				reset_token_expires: {
					lt: now,
				},
				reset_token: {
					not: null,
				},
			},
			data: {
				reset_token: null,
				reset_token_expires: null,
			},
		});

		return result.count;
	}
}
