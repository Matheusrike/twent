import { Prisma } from '@prisma/client/extension';
import prisma from '@prisma/client';
import { validateLocation } from '@/helpers/validate-location.helper';
import {
	IEmployeeProps,
	IUser,
	TypeGetUserProps,
} from '@/types/users.types';
import { validatePassword } from '@/utils/password.util';
import { UserService } from './User.service';
import { AppError } from '@/utils/errors.util';

export class EmployeeService extends UserService {
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

	async create(
		data: IEmployeeProps,
		roleName: string,
		storeCode: string,
	) {
		let response = {};
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

		const employee = await prisma.$transaction(async (tx) => {
			const role = await tx.role.findUnique({
				where: { name: roleName },
			});
			if (!role) {
				throw new AppError({
					message: 'Cargo não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}
			const store = await tx.store.findUnique({
				where: { code: storeCode },
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
			});

			const employee_code = await this.generateEmployeeCodeTx(
				tx,
				storeCode,
				new Date(),
			);

			response = await tx.employee.create({
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
			});
			response = await tx.userRole.create({
				data: {
					user_id: user.id,
					role_id: role.id,
				},
			});
			return response;
		});
		return employee;
	}

	async get(filters: TypeGetUserProps, skip = 0, take = 10) {
		filters.user_type = 'EMPLOYEE';

		const response = await super.get(filters, skip, take);

		return response
	
	}

	async update(
		id: string,
		data?: Partial<IUser>,
		employeeData?: Partial<IEmployeeProps>,
		roleName?: string,
		storeCode?: string,
	) {
        
		const user = await prisma.user.findUnique({ where: { id } });

		if (!user) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});
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

		await this.validateUser(data?.email, data?.document_number);
		if (data?.password_hash) {
			data.password_hash = await validatePassword(
				data?.password_hash,
			);
		}

		await prisma.$transaction(async (tx) => {
			const role = await tx.role.findUnique({
				where: { name: roleName },
			});
			if (!role) {
				throw new AppError({
					message: 'Cargo não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}
			const store = await tx.store.findUnique({
				where: { code: storeCode },
			});
			if (!store) {
				throw new AppError({
					message: 'Filial não encontrada',
					errorCode: 'NOT_FOUND',
				});
			}
			const user = await tx.user.update({
				where: { id },
				data: {
					...data,
				},
			});
			await tx.employee.update({
				where: { user_id: id },
				data: {
					...employeeData,
				},
			});
			return user;
		});
	}
}
