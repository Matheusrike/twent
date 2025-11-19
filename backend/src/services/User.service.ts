import { AppError } from '@/utils/errors.util';
import { PrismaClient } from '@prisma/generated/client';
import { CustomerQuerystring } from '@/schemas/customer.schema';
import { EmployeeQuerystring } from '@/schemas/employee.schema';
import bcrypt from 'bcryptjs';
import { comparePassword } from '@/utils/password.util';

export class UserService {
	constructor(protected database: PrismaClient) {}

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

	async get(
		filters: CustomerQuerystring | EmployeeQuerystring,
		skip = 0,
		take = 10,
		id?: string,
	) {
		try {
			if (filters.user_type === 'EMPLOYEE') {
				const response = await this.database.user.findMany({
					cursor: id ? { id } : undefined,
					take: Number(take),
					skip: Number(skip),
					orderBy: { created_at: 'desc' },
					where: filters,
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
				where: filters,
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
                        }
                    }
                }
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
                                }
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
								name: true
							}
						}
                    }
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

    async changePassword(id: string, password: string) {
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
         
            const isValid =  await comparePassword(password, user.password_hash);
            if (!isValid) {
                throw new AppError({
                    message: 'Senha incorreta',
                    errorCode: 'BAD_REQUEST',
                });
            }
            const response = await this.database.user.update({
                where: { id },
                data: { password_hash: password },
            });
            return response;
        } catch (error) {
            throw new AppError({
                message: error.message,
                errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
            });
        }
    }
}
