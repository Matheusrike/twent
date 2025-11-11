import { validateLocation } from '@/helpers/validate-location.helper';
import { AppError } from '@/utils/errors.util';
import { UserService } from './User.service';
import { comparePassword, validatePassword } from '@/utils/password.util';
import { CreateCustomer, CustomerQuerystring } from '@/schemas/customer.schema';
import { PrismaClient } from '@prisma/generated/client';

export class CustomerService extends UserService {
	constructor(private prisma: PrismaClient) {
		super(prisma);
	}
	async createCustomer(data: CreateCustomer) {
		await this.validateUser(
			data.email,
			data.document_number,
		);

		data.password_hash = await validatePassword(
			data.password_hash,
		);
		if (data.birth_date) {
			data.birth_date = new Date(data.birth_date!);
		}
		if (
			data.country ||
			data.state ||
			data.city ||
			data.street ||
			data.district ||
			data.zip_code
		) {
			await validateLocation({
				country: data.country,
				state: data.state,
				city: data.city,
				road: data.street,
				district: data.district,
				postalcode: data.zip_code,
			});
		}
		const user = await this.database.user.create({
			data: { ...data, is_active: true, user_type: 'CUSTOMER' },
		});
		return user;
	}

	async getCustomers(filters: CustomerQuerystring, skip: number, take: number) {
		filters.user_type = 'CUSTOMER';
		const response = await super.get(filters, skip, take);
		return response;
	}

	async updateCustomer(id: string, data: Partial<CreateCustomer>) {
		const user = await this.database.user.findUnique({ where: { id } });

		if (!user) {
			throw new AppError({
				message: 'Usuário não encontrado',
				errorCode: 'NOT_FOUND',
			});
		}
		if (
			data.country ||
			data.state ||
			data.city ||
			data.street ||
			data.district ||
			data.zip_code
		) {
			await validateLocation({
				country: data.country,
				state: data.state,
				city: data.city,
				road: data.street,
				district: data.district,
				postalcode: data.zip_code,
			});
		}
		await this.validateUser(
			data.email,
			data.document_number,
		);

		if (data.password_hash) {
			const isValid = await comparePassword(
				data.password_hash,
				user.password_hash,
			);
			if (!isValid) {
				throw new AppError({
					message: 'Senha inválida',
					errorCode: 'UNAUTHORIZED',
				});
			}
			data.password_hash = await validatePassword(
				data.password_hash,
			);
		}

		if (data.birth_date) {
			data.birth_date = new Date(data.birth_date);
		}

		return await this.database.user.update({
			where: { id },
			data: { ...data, user_type: 'CUSTOMER' },
		});
	}
}
