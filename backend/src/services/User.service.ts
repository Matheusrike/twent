import { AppError } from '@/utils/errors.util';
import prisma from '@prisma/client';
import { TypeGetUserProps } from '@/types/users.types';

export class  UserService {
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
		let response;

        console.log('UserService.get called with params:', { params, skip, take, id });
		if (params?.user_type === 'EMPLOYEE') {
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
					phone: true,
					user_type: true,
					city: true,
					district: true,
					state: true,
                    country: true,
					street: true,
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
					birth_date: true,
					user_type: true,
					document_number: true,
					city: true,
					number: true,
					district: true,
					state: true,
					street: true,
					country: true,
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

		return response;
	}

	async getInfo(id: string) {
		const user = await prisma.user.findUnique({
			where: { id },
		});

		if (!user) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'USER_NOT_FOUND',
			});
		}
		return user;
	}

	async changeStatus(id: string, newStatus: boolean) {
		const user = await this.get({ id } as TypeGetUserProps);
		if (!user) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});
		}

		if (newStatus === user[0].is_active) {
			throw new AppError({
				message:
					newStatus === true
						? 'Usuário já ativo'
						: 'Usuário já inativo',
				errorCode: 'CONFLICT',
			});
		}

		if (user[0].user_type === 'EMPLOYEE') {
			const employee = await prisma.$transaction(async (tx) => {
				const res = await tx.user.update({
					where: { id: id },
					data: { is_active: newStatus },
					select: {
						id: true,
						email: true,
						first_name: true,
						last_name: true,
						user_type: true,
						is_active: true,
					},
				});
				await tx.employee.update({
					where: { user_id: id },
					data: { is_active: newStatus },
				});
				return res;
			});
			return employee;
		}

		const customer = await prisma.user.update({
			where: { id: id },
			data: { is_active: newStatus },
			select: {
				id: true,
				email: true,
				first_name: true,
				last_name: true,
				user_type: true,
				is_active: true,
			},
		});

		return customer;
	}
}
