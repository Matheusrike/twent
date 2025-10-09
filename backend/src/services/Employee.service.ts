import { Prisma } from '@prisma/client/extension';
import prisma from '../../prisma/client.ts';
import { validateLocation } from '../helpers/validate-location.helper.ts';
import {
	IEmployeeProps,
	IUser,
	TypeGetUserProps,
} from '../types/users.types.ts';
import { validatePassword } from '../utils/password.util.ts';
import { UserService } from './User.service.ts';
import { AppError } from '../utils/errors.util.ts';

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
		userData: IUser,
		employeeData: IEmployeeProps,
		roleName: string,
		storeCode: string,
	) {
		let response = {};
		await this.validateUser(userData?.email, userData?.document_number);

		userData.password_hash = await validatePassword(userData.password_hash);

		await validateLocation({
			country: userData?.country,
			state: userData?.state,
			city: userData?.city,
			road: userData?.street,
			district: userData?.district,
			postalcode: userData?.zip_code,
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
					...userData,
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
					...employeeData,
					user_id: user.id,
					position: employeeData.position || '',
					salary: employeeData.salary || 0.0,
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

		return {
			...response,
		};
	}

	async update(
		id: string,
		userData?: Partial<IUser>,
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
			userData?.country ||
			userData?.state ||
			userData?.city ||
			userData?.street ||
			userData?.district ||
			userData?.zip_code
		) {
			await validateLocation({
				country: userData?.country,
				state: userData?.state,
				city: userData?.city,
				road: userData?.street,
				district: userData?.district,
				postalcode: userData?.zip_code,
			});
		}

		await this.validateUser(userData?.email, userData?.document_number);
		if (userData?.password_hash) {
			userData.password_hash = await validatePassword(
				userData?.password_hash,
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
					...userData,
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
