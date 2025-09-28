import { AppError } from '../utils/errors.util.ts';
import prisma from '../../prisma/client.ts';
import { TypeGetUserProps } from '../types/users.types.ts';

export class UserService {
	async validateUser(email?: string, document_number?: string) {
		if (email !== undefined) {
			const usedEmail = await prisma.user.findUnique({
				where: { email },
			});

			if (usedEmail) {
				throw new AppError({
					message: 'Email já em uso',
					errorCode: 'CONFLICT',
				});
			}
		}
		if (document_number === undefined) return true;
		const usedDocument = await prisma.user.findUnique({
			where: { document_number },
		});
		if (usedDocument) {
			throw new AppError({
				message: 'Número de documento já registrado',
				errorCode: 'CONFLICT',
			});
		}
		return true;
	}

	async get(params: TypeGetUserProps, cursor?: string, take: number = 10) {
		if (
			params.user_type &&
			params.user_type !== 'CUSTOMER' &&
			params.user_type !== 'EMPLOYEE'
		) {
			throw new AppError({
				message: 'Tipo de usuário inválido',
				errorCode: 'BAD_REQUEST',
			});
		}

		let response;

		if (params.user_type === 'EMPLOYEE') {
			response = await prisma.user.findMany({
				cursor: cursor ? { id: cursor } : undefined,
				take: Number(take) + 1,
				skip: cursor ? 1 : 0,
				orderBy: { created_at: 'desc' },
				where: params,
				select: {
					id: true,
					email: true,
					first_name: true,
					last_name: true,
					user_type: true,
					created_at: true,
					is_active: true,
					employee: {
						select: {
							position: true,
							salary: true,
							is_active: true,
						},
					},
					user_roles: {
						select: {
							role: {
								select: { name: true },
							},
						},
					},
					store: {
						select: {
							code: true,
							name: true,
						},
					},
				},
			});
		} else {
			response = await prisma.user.findMany({
				cursor: cursor ? { id: cursor } : undefined,
				take: Number(take) + 1,
				skip: cursor ? 1 : 0,
				where: params,
				orderBy: { created_at: 'desc' },
				select: {
					id: true,
					email: true,
					first_name: true,
					last_name: true,
					user_type: true,
					is_active: true,
					created_at: true,
				},
			});
		}
		if (response.length === 0) {
			throw new AppError({
				message: 'Nenhum usuário encontrado',
				errorCode: 'NOT_FOUND',
			});
		}

		const hasNextPage = response.length > take;
		const data = hasNextPage ? response.slice(0, -1) : response;
		const nextCursor = hasNextPage ? data[data.length - 1].id : null;
		const total = await prisma.user.count({ where: params });

		return {
			reply: response,
			pagination: {
				nextCursor,
				hasNextPage,
				take,
				total,
			},
		};
	}

	async getInfo(id: string) {
		const user = await prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});
		}
		return user;
	}

	async changeStatus(id: string, newStatus: boolean) {
		const user = await this.get({ id });
		if (!user) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});
		}

		console.log(user['reply'][0].user_type);

		if (newStatus === user['reply'][0].is_active) {
			throw new AppError({
				message:
					newStatus === true
						? 'Usuário já ativo'
						: 'Usuário já inativo',
				errorCode: 'BAD_REQUEST',
			});
		}

		if (user['reply'][0].user_type === 'EMPLOYEE') {
			const employee = await prisma.$transaction(async (tx) => {
				const res1 = await tx.user.update({
					where: { id: id },
					data: { is_active: newStatus },
				});
				const res2 = await tx.employee.update({
					where: { user_id: id },
					data: { is_active: newStatus },
				});
				return { res1, res2 };
			});
			return employee;
		}

		const customer = await prisma.user.update({
			where: { id: id },
			data: { is_active: newStatus },
		});

		return customer;
	}
}
