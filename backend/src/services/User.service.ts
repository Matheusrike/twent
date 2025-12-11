import { AppError } from '@/utils/errors.util';
import { PrismaClient } from '@prisma/generated/client';
import { CustomerQuerystring } from '@/schemas/customer.schema';
import { EmployeeQuerystring } from '@/schemas/employee.schema';

export class UserService {
	constructor(protected database: PrismaClient) {}

	async validateUser(email?: string, document_number?: string, excludeUserId?: string) {
		if (email !== undefined) {
			const whereClause: any = { email };
			// Se excludeUserId fornecido, exclui esse usuário da verificação
			if (excludeUserId) {
				whereClause.id = { not: excludeUserId };
			}
			
			const usedEmail = await this.database.user.findFirst({
				where: whereClause,
			});

			if (usedEmail) {
				throw new AppError({
					message: 'Email já em uso',
					errorCode: 'CONFLICT',
				});
			}
		}
		if (document_number === undefined) return true;
		
		const whereClause: any = { document_number };
		// Se excludeUserId fornecido, exclui esse usuário da verificação
		if (excludeUserId) {
			whereClause.id = { not: excludeUserId };
		}
		
		const usedDocument = await this.database.user.findFirst({
			where: whereClause,
		});
		if (usedDocument) {
			throw new AppError({
				message: 'Número de documento já registrado',
				errorCode: 'CONFLICT',
			});
		}
		return true;
	}

	async get(
		filters: CustomerQuerystring | EmployeeQuerystring,
		skip = 0,
		take = 10,
		storeId?: string,
		id?: string,
	) {
		try {
			if (filters.user_type === 'EMPLOYEE') {
				const whereClause: any = { ...filters };
				// Se storeId for fornecido, filtra por loja; caso contrário, não filtra
				if (storeId !== undefined) {
					whereClause.store_id = storeId;
				}
				
				const response = await this.database.user.findMany({
					cursor: id ? { id } : undefined,
					take: Number(take),
					skip: Number(skip),
					orderBy: { created_at: 'desc' },
					where: whereClause,
					select: {
						id: true,
						email: true,
						first_name: true,
						last_name: true,
						phone: true,
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
			const whereClause: any = { ...filters };
			// Se storeId for fornecido, filtra por loja; caso contrário, não filtra
			if (storeId !== undefined) {
				whereClause.store_id = storeId;
			}
			
			const response = await this.database.user.findMany({
				cursor: id ? { id } : undefined,
				take: Number(take),
				skip: Number(skip),
				orderBy: { created_at: 'desc' },
				where: whereClause,
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
			console.log(error);
			throw new AppError({
				message: error.message,
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async getInfo(id: string) {
		try {
			const user = await this.database.user.findUnique({
				where: { id },
				omit: { password_hash: true },
				include: {
					sales_created: true,
					CustomerFavorite: {
						select: {
							product: {
								select: {
									name: true,
									price: true,
								},
							},
						},
					},
				},
			});

			if (!user) {
				throw new AppError({
					message: 'Usuário não encontrado',
					errorCode: 'USER_NOT_FOUND',
				});
			}

			if (user?.user_type === 'EMPLOYEE') {
				const profile = await this.database.user.findUnique({
					where: { id },
					omit: { password_hash: true },
					include: {
						employee: {
							select: {
								position: true,
								salary: true,
								benefits: true,
								hire_date: true,
								is_active: true,
								leaves: {
									select: {
										type: true,
										start_date: true,
										end_date: true,
									},
								},
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
								name: true,
								code: true,
							},
						},
					},
				});
				if (!profile) {
					throw new AppError({
						message: 'Funcionario nao encontrado',
						errorCode: 'USER_NOT_FOUND',
					});
				}
				return profile;
			}

			return user;
		} catch (error) {
			console.log(error);
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
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
						data: { is_active: false },
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

	async deleteUser(id: string) {
		try {
			const userExist = await this.database.user.findUnique({
				where: { id },
				include: {
					employee: true,
					user_roles: true,
				},
			});

			if (!userExist) {
				throw new AppError({
					message: 'Usuário não encontrado',
					errorCode: 'USER_NOT_FOUND',
				});
			}

			// Se for funcionário, deleta também o registro de employee e user_roles
			if (userExist.user_type === 'EMPLOYEE') {
				await this.database.$transaction(async (tx) => {
					// Deleta user_roles primeiro (foreign key constraint)
					await tx.userRole.deleteMany({
						where: { user_id: id },
					});

					// Deleta employee
					await tx.employee.deleteMany({
						where: { user_id: id },
					});

					// Deleta user
					await tx.user.delete({
						where: { id },
					});
				});
			} else {
				// Para outros tipos de usuário (CUSTOMER, etc)
				await this.database.$transaction(async (tx) => {
					// Deleta user_roles primeiro
					await tx.userRole.deleteMany({
						where: { user_id: id },
					});

					// Deleta user
					await tx.user.delete({
						where: { id },
					});
				});
			}

			return { message: 'Usuário deletado com sucesso' };
		} catch (error) {
			if (error instanceof AppError) {
				throw error;
			}
			throw new AppError({
				message: error.message || 'Erro ao deletar usuário',
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}
}
