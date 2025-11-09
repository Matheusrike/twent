import { AppError } from '@/utils/errors.util';
import { TypeGetUserProps } from '@/types/users.types';
import { PrismaClient } from '@prisma/generated/client';

export class UserService {
	constructor(private database: PrismaClient) {}

	async validateUser(email?: string, document_number?: string) {
		if (email !== undefined) {
			const usedEmail = await this.database.user.findUnique({
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
		const usedDocument = await this.database.user.findUnique({
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
        try{
		if (params?.user_type === 'EMPLOYEE') {
			const response = await this.database.user.findMany({
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
			return response;
		}
		const response = await this.database.user.findMany({
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

		return response;
    } catch (error) {
        console.log(error)
        throw new AppError({
            message: error.message,
            errorCode: 'INTERNAL_SERVER_ERROR',
        })
    }
	}

	async getInfo(id: string) {
		const user = await this.database.user.findUnique({
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

	async activateUser(id: string) {
		try {
			const userExist = await this.database.user.findUnique({
				where: { id },
			});
			if (!userExist) {
				throw new AppError({
					message: 'Usuário nao encontrado',
					errorCode: 'USER_NOT_FOUND',
				});
			}

			if (userExist.user_type == 'EMPLOYEE') {
				const employee = await this.database.employee.findUnique({
					where: { user_id: id },
				});
				if (!employee) {
					throw new AppError({
						message: 'Funcionario nao encontrado',
						errorCode: 'USER_NOT_FOUND',
					});
				}
				const user = await this.database.$transaction(async (tx) => {
					const res = await tx.user.update({
						where: { id: id },
						data: { is_active: true },
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
						data: { is_active: true },
					});
					return res;
				});
				return user;
			}

			const user = await this.database.user.update({
				where: { id },
				data: { is_active: true },
				select: {
					id: true,
					email: true,
					first_name: true,
					last_name: true,
					user_type: true,
					is_active: true,
				},
			});
			return user;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}
	async deactivateUser(id: string) {
		try {
			const userExist = await this.database.user.findUnique({
				where: { id },
			});
			if (!userExist) {
				throw new AppError({
					message: 'Usuário nao encontrado',
					errorCode: 'USER_NOT_FOUND',
				});
			}

			if (userExist.user_type == 'EMPLOYEE') {
				const employee = await this.database.employee.findUnique({
					where: { user_id: id },
				});
				if (!employee) {
					throw new AppError({
						message: 'Funcionario nao encontrado',
						errorCode: 'USER_NOT_FOUND',
					});
				}
				const user = await this.database.$transaction(async (tx) => {
					const res = await tx.user.update({
						where: { id: id },
						data: { is_active: false },
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
						data: { is_active: true },
					});
					return res;
				});
				return user;
			}

			const user = await this.database.user.update({
				where: { id },
				data: { is_active: false },
				select: {
					id: true,
					email: true,
					first_name: true,
					last_name: true,
					user_type: true,
					is_active: true,
				},
			});
			return user;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
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
			const employee = await this.database.$transaction(async (tx) => {
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

		const customer = await this.database.user.update({
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
