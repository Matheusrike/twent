import type { PrismaClient } from '@prisma/generated/client';
import type {
	IJwtAuthPayload,
	IJwtProvider,
	ILoginInput,
} from '@/types/authorization.types';
import { AppError } from '@/utils/errors.util';
import bcrypt from 'bcryptjs';
import { comparePassword, validatePassword } from '@/utils/password.util';

export class AuthService {
	constructor(
		private database: PrismaClient,
		private jwtProvider: IJwtProvider,
	) {}

	async login({ email, password }: ILoginInput) {
        try {
		const user = await this.database.user.findFirst({
			where: { email },
			select: {
				id: true,
				password_hash: true,
				is_active: true,
				first_name: true,
				email: true,
				store_id: true,
				store: {
					select: {
						is_active: true,
					},
				},
			},
		});

		if (!user)
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});

		if (!user.is_active)
			throw new AppError({
				message: 'Usuário inativo',
				errorCode: 'CONFLICT',
			});

		const isPasswordValid = await bcrypt.compare(
			password,
			user.password_hash,
		);

		if (!isPasswordValid)
			throw new AppError({
				message: 'Senha inválida',
				errorCode: 'INVALID_PASSWORD',
			});
		if (user.store?.is_active === false) {
			throw new AppError({
				message: 'Loja inativa',
				errorCode: 'CONFLICT',
			});
		}

		const userRoles = await this.database.userRole.findMany({
			where: { user_id: user.id },
			select: {
				role: {
					select: {
						name: true,
					},
				},
			},
		});

		await this.database.user
			.update({
				where: { id: user.id },
				data: { last_login_at: new Date() },
			})
			.catch(() => {
				throw new AppError({
					message: 'Erro ao atualizar último login',
					errorCode: 'UPDATE_LAST_LOGIN_FAILED',
				});
			});

		const token: IJwtAuthPayload = {
			id: user.id,
			roles: userRoles.map((r) => r.role.name),
			storeId: user.store_id || undefined,
		};

		return this.jwtProvider.sign(token, { expiresIn: '1d' });
    } catch (error) {
        console.log(error);
        throw new AppError({
            message: error.message,
            errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
        });
    }
	}
	async changePassword(id: string, password: string, newPassword: string) {
		try {
			const user = await this.database.user.findUnique({
				where: { id },
			});
			if (!user) {
				throw new AppError({
					message: 'Usuário nao encontrado',
					errorCode: 'USER_NOT_FOUND',
				});
			}

			const isValid = await comparePassword(password, user.password_hash);
			if (!isValid) {
				throw new AppError({
					message: 'Senha incorreta',
					errorCode: 'BAD_REQUEST',
				});
			}

			const hashedPassword = await validatePassword(newPassword);
			await this.database.user.update({
				where: { id },
				data: { password_hash: hashedPassword },
			});
			return;
		} catch (error) {
			console.log(error);
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}
}
