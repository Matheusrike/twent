import { validateLocation } from '../helpers/validate-location.helper.ts';
import prisma from '../../prisma/client.ts';
import { IGetUserProps, IUser } from '../types/users.types.ts';
import { AppError } from '../utils/errors.util.ts';
import { UserService } from './user.service.ts';
import { comparePassword, validatePassword } from '../utils/password.util.ts';

export class CustomerService extends UserService {
	async create(customerData: IUser) {
		await this.validateUser(
			customerData.email,
			customerData.document_number,
		);

		customerData.password_hash = await validatePassword(
			customerData.password_hash,
		);
		if (customerData.birth_date) {
			customerData.birth_date = new Date(customerData.birth_date!);
		}
		await validateLocation({
			country: customerData.country,
			state: customerData.state,
			city: customerData.city,
			road: customerData.street,
			district: customerData.district,
			zip_code: customerData.zip_code,
		});
		const user = await prisma.user.create({
			data: { ...customerData, is_active: true, user_type: 'CUSTOMER' },
		});
		return user;
	}
	async getAll() {
		const users = await prisma.user.findMany({
			where: { user_type: 'CUSTOMER' },
		});

		return users;
	}

	async get(params: IGetUserProps) {
		const user = await prisma.user.findMany({
			where: { ...params, user_type: 'CUSTOMER' },
		});

		return user;
	}

	async update(id: string, customerData: Partial<IUser>) {
		const user = await this.get({ id });

		if (!user) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});
		}
		await validateLocation({
			country: customerData.country,
			state: customerData.state,
			city: customerData.city,
			road: customerData.street,
			district: customerData.district,
			zip_code: customerData.zip_code,
		});
		await this.validateUser(
			customerData.email,
			customerData.document_number,
		);

		if (customerData.password_hash) {
			const isValid = await comparePassword(
				customerData.password_hash,
				user[0].password_hash,
			);
			if (!isValid) {
				throw new AppError({
					message: 'Senha inválida',
					errorCode: 'UNAUTHORIZED',
				});
			}
			customerData.password_hash = await validatePassword(
				customerData.password_hash,
			);
		}

		if (customerData.birth_date) {
			customerData.birth_date = new Date(customerData.birth_date);
		}

		return await prisma.user.update({
			where: { id },
			data: { ...customerData, user_type: 'CUSTOMER' },
		});
	}
}
