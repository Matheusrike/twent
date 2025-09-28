import { Prisma } from '@prisma/client';
import prisma from '../../prisma/client.ts';
import { validateLocation } from '../helpers/validate-location.helper.ts';
import { IEmployeeProps, TypeGetUserProps } from '../types/users.types.ts';
import { validatePassword } from '../utils/password.util.ts';
import { UserService } from './user.service.ts';
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
		employeeData: IEmployeeProps,
		roleName: string,
		storeCode: string,
	) {
		let response = {};
		await this.validateUser(
			employeeData.email,
			employeeData.document_number,
		);

		employeeData.password_hash = await validatePassword(
			employeeData.password_hash,
		);

		await validateLocation({
			country: employeeData.country,
			state: employeeData.state,
			city: employeeData.city,
			road: employeeData.street,
			district: employeeData.district,
			postalcode: employeeData.zip_code,
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
					email: employeeData.email,
					password_hash: employeeData.password_hash,
					first_name: employeeData.first_name,
					last_name: employeeData.last_name,
					phone: employeeData.phone,
					user_type: 'EMPLOYEE',
					document_number: employeeData.document_number,
					street: employeeData.street,
					number: employeeData.number,
					city: employeeData.city,
					state: employeeData.state,
					country: employeeData.country,
					zip_code: employeeData.zip_code,
					birth_date: employeeData.birth_date,
					district: employeeData.district,
					is_active: true,
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
					employee_code,
					user_id: user.id,
					position: employeeData.position,
					department: employeeData.department,
					salary: employeeData.salary,
					currency: employeeData.currency,
					benefits: employeeData.benefits,
					emergency_contact: employeeData.emergency_contact,
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

	async get(params: TypeGetUserProps, cursor?: string, take: number = 10) {
		console.log(params, cursor, take);
		params.user_type = 'EMPLOYEE';
		const response = await super.get(params, cursor, take);

		return {
			...response,
		};
	}
}
