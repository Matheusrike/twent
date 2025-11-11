import type { PrismaClient } from '@prisma/generated/client';
import type {
	IJwtAuthPayload,
	IJwtProvider,
	ILoginInput,
} from '@/types/authorization.types';
import { AppError } from '@/utils/errors.util';
import bcrypt from 'bcryptjs';

export class AuthService {
	constructor(
		private database: PrismaClient,
		private jwtProvider: IJwtProvider,
	) {}

	async login({ email, password }: ILoginInput) {
		const user = await this.database.user.findFirst({
			where: { email },
			select: {
				id: true,
				password_hash: true,
				is_active: true,
				first_name: true,
				email: true,
				store_id: true,
			},
		});

		if (!user)
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'USER_NOT_FOUND',
			});

		if (!user.is_active)
			throw new AppError({
				message: 'Usuário inativo',
				errorCode: 'USER_INACTIVE',
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
	}
}
