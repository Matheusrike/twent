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

	async get(params?: TypeGetUserProps, skip = 0, take = 10, id?: string) {
		console.log(params);

		let response;

		if (params?.user_type == 'EMPLOYEE') {
			response = await prisma.user.findMany({
				cursor: id ? { id } : undefined,
				take: Number(take),
				skip: Number(skip),
				orderBy: { created_at: 'desc' },
				where: params,
				select: {
					id: true,
					email: true,
					first_name: true,
					last_name: true,
					user_type: true,
					city: true,
					district: true,
					state: true,
					street: true,
					phone: true,
					is_active: true,
					created_at: true,
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
				cursor: id ? { id } : undefined,
				take: Number(take),
				skip: Number(skip),
				orderBy: { created_at: 'desc' },
				where: params,
				select: {
					id: true,
					email: true,
					first_name: true,
					last_name: true,
					user_type: true,
					city: true,
					district: true,
					state: true,
					street: true,
					phone: true,
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

		const hasNextPage = response.length > take!;
		const data = hasNextPage ? response.slice(0, -1) : response;
		const nextCursor = hasNextPage ? data[data.length - 1].id : null;
		const total = await prisma.user.count({ where: params });

		return {
			...response,
			pagination: {
				nextCursor,
				hasNextPage,
				take: take,
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

		console.log(user.pop()?.is_active);

		if (newStatus === user.pop()?.is_active) {
			throw new AppError({
				message:
					newStatus === true
						? 'Usuário já ativo'
						: 'Usuário já inativo',
				errorCode: 'BAD_REQUEST',
			});
		}

		if (user.pop()?.user_type === 'EMPLOYEE') {
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
