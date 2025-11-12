import { Prisma } from '@prisma/client/extension';
import { validateLocation } from '@/helpers/validate-location.helper';
import { validatePassword } from '@/utils/password.util';
import { UserService } from './User.service';
import { AppError } from '@/utils/errors.util';
import { CreateEmployee, EmployeeQuerystring } from '@/schemas/employee.schema';
import { PrismaClient } from '@prisma/generated/client';

export class EmployeeService extends UserService {
	constructor(private prisma: PrismaClient) {
		super(prisma);
	}
	private async generateEmployeeCodeTx(
		tx: Prisma.TransactionClient,
		filialCode: string,
		hireDate: Date,
	): Promise<string> {
		const prefix = 'TW';
		const yy = String(hireDate.getFullYear()).slice(-2);
		const mm = String(hireDate.getMonth() + 1).padStart(2, '0');
		const ff = filialCode.slice(-3).padStart(3, '0');
		const base = `${prefix}${yy}${mm}${ff}`;

		const last = await tx.employee.findFirst({
			where: { employee_code: { startsWith: base } },
			orderBy: { created_at: 'desc' },
		});

		const lastSeq = last?.employee_code?.slice(-3);
		const nextSeq = String(Number(lastSeq ?? '0') + 1).padStart(3, '0');
		return `${base}${nextSeq}`;
	}

	async createEmployee(data: CreateEmployee, id: string) {
		try {
			await this.validateUser(data?.email, data?.document_number);

			data.password_hash = await validatePassword(data.password_hash);

			await validateLocation({
				country: data?.country,
				state: data?.state,
				city: data?.city,
				road: data?.street,
				district: data?.district,
				postalcode: data?.zip_code,
			});

			if (!data.store_code) {
				const user = await this.database.user.findUnique({
					where: { id },
				});

				const storeId = await this.database.store.findFirst({
					where: { id: user!.store_id! },
				});
				data.store_code = storeId!.code;
			}
			const employeeCreated = await this.database.$transaction(
				async (tx) => {
					const role = await tx.role.findUnique({
						where: { name: data.role },
					});
					if (!role) {
						throw new AppError({
							message: 'Cargo não encontrado',
							errorCode: 'NOT_FOUND',
						});
					}
					const store = await tx.store.findUnique({
						where: { code: data.store_code },
					});
					if (!store) {
						throw new AppError({
							message: 'Filial não encontrada',
							errorCode: 'NOT_FOUND',
						});
					}
					const user = await tx.user.create({
						data: {
							email: data.email,
							document_number: data.document_number,
							password_hash: data.password_hash,
							first_name: data.first_name,
							last_name: data.last_name,
							phone: data.phone,
							birth_date: data.birth_date,
							street: data.street,
							number: data.number,
							district: data.district,
							city: data.city,
							state: data.state,
							zip_code: data.zip_code,
							country: data.country,
							created_at: new Date(),
							updated_at: new Date(),
							is_active: true,
							user_type: 'EMPLOYEE',
							store_id: store.id,
						},
						omit: { password_hash: true },
					});

					const employee_code = await this.generateEmployeeCodeTx(
						tx,
						data.store_code!,
						new Date(),
					);

					const employee = await tx.employee.create({
						data: {
							national_id: data.national_id,
							department: data.department,
							currency: data.currency,
							user_id: user.id,
							position: data.position || '',
							salary: data.salary || 0.0,
							employee_code,
							hire_date: new Date(),
							is_active: true,
						},
						omit: { user_id: true },
					});
					await tx.userRole.create({
						data: {
							user_id: user.id,
							role_id: role.id,
						},
					});
					return { user, employee };
				},
			);
			return employeeCreated;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async getEmployees(
		filters: EmployeeQuerystring,
		skip: number,
		take: number,
	) {
		filters.user_type = 'EMPLOYEE';

		const response = await super.get(filters, skip, take);

		return response;
	}

	async updateEmployee(id: string, data: Partial<CreateEmployee>) {
		try {
			const user = await this.database.user.findUnique({ where: { id } });

			if (!user) {
				throw new AppError({
					message: 'Usuário não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}

			await this.validateUser(data?.email, data?.document_number);

			if (data?.password_hash) {
				data.password_hash = await validatePassword(data.password_hash);
			}

			if (
				data?.country ||
				data?.state ||
				data?.city ||
				data?.street ||
				data?.district ||
				data?.zip_code
			) {
				await validateLocation({
					country: data?.country,
					state: data?.state,
					city: data?.city,
					road: data?.street,
					district: data?.district,
					postalcode: data?.zip_code,
				});
			}

			if (!data?.store_code) {
				const store = await this.database.store.findFirst({
					where: { id: user.store_id! },
				});
				data!.store_code = store!.code!;
			}

			const updatedEmployee = await this.database.$transaction(
				async (tx) => {
					let role = null;
					if (data?.role) {
						role = await tx.role.findUnique({
							where: { name: data.role },
						});

						if (!role) {
							throw new AppError({
								message: 'Cargo não encontrado',
								errorCode: 'NOT_FOUND',
							});
						}
					}
					const store = await tx.store.findUnique({
						where: { code: data?.store_code },
					});
					if (!store) {
						throw new AppError({
							message: 'Filial não encontrada',
							errorCode: 'NOT_FOUND',
						});
					}

					const updatedUser = await tx.user.update({
						where: { id },
						data: {
							email: data?.email,
							document_number: data?.document_number,
							password_hash: data?.password_hash,
							first_name: data?.first_name,
							last_name: data?.last_name,
							phone: data?.phone,
							birth_date: data?.birth_date,
							street: data?.street,
							number: data?.number,
							district: data?.district,
							city: data?.city,
							state: data?.state,
							zip_code: data?.zip_code,
							country: data?.country,
							updated_at: new Date(),
							is_active: data?.is_active ?? user.is_active,
							user_type: 'EMPLOYEE',
							store_id: store.id,
						},
					});

					const updatedEmployee = await tx.employee.update({
						where: { user_id: id },
						data: {
							national_id: data?.national_id,
							department: data?.department,
							currency: data?.currency,
							user_id: updatedUser.id,
							position: data?.position || '',
							salary: data?.salary || 0.0,
							is_active: data?.is_active ?? true,
							updated_at: new Date(),
						},
					});

					if (!role) return { updatedUser, updatedEmployee };

					await tx.userRole.upsert({
						where: {
							user_id_role_id: {
								user_id: user.id,
								role_id: role.id,
							},
						},
						create: {
							user_id: user.id,
							role_id: role.id,
						},
						update: {
							role_id: role.id,
						},
					});

					return [updatedUser, updatedEmployee];
				},
			);

			return updatedEmployee;
		} catch (error) {
			throw new AppError({
				message: error.message || 'Erro interno no servidor',
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}
}
