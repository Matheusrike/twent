import { validateLocation } from '../helpers/validate-location.helper.ts';
import prisma from '../../prisma/client.ts';
import { TypeGetUserProps, IUser } from '../types/users.types.ts';
import { AppError } from '../utils/errors.util.ts';
import { UserService } from './User.service.ts';
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
		if (
			customerData.country ||
			customerData.state ||
			customerData.city ||
			customerData.street ||
			customerData.district ||
			customerData.zip_code
		) {
			await validateLocation({
				country: customerData.country,
				state: customerData.state,
				city: customerData.city,
				road: customerData.street,
				district: customerData.district,
				postalcode: customerData.zip_code,
			});
		}
		const user = await prisma.user.create({
			data: { ...customerData, is_active: true, user_type: 'CUSTOMER' },
		});
		return user;
	}

	async get(filters: TypeGetUserProps, skip = 0, take = 10) {
		filters.user_type = 'CUSTOMER';

		const response = await super.get(filters, skip, take);

		return {
			...response,
		};
	}

	async update(id: string, customerData: Partial<IUser>) {
		const user = await prisma.user.findUnique({ where: { id } });

		if (!user) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});
		}
		if (
			customerData.country ||
			customerData.state ||
			customerData.city ||
			customerData.street ||
			customerData.district ||
			customerData.zip_code
		) {
			await validateLocation({
				country: customerData.country,
				state: customerData.state,
				city: customerData.city,
				road: customerData.street,
				district: customerData.district,
				postalcode: customerData.zip_code,
			});
		}
		await this.validateUser(
			customerData.email,
			customerData.document_number,
		);

		if (customerData.password_hash) {
			const isValid = await comparePassword(
				customerData.password_hash,
				user.password_hash,
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
