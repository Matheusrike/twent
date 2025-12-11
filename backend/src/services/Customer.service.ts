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
		
		// Normaliza email para lowercase
		const normalizedData = {
			...data,
			email: data.email.toLowerCase().trim(),
			is_active: true,
			user_type: 'CUSTOMER' as const,
		};
		
		const user = await this.database.user.create({
			data: normalizedData,
            omit: { password_hash: true },
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

		// Normaliza email para lowercase se fornecido
		const updateData: any = { ...data, user_type: 'CUSTOMER' };
		if (data.email) {
			updateData.email = data.email.toLowerCase().trim();
		}

		return await this.database.user.update({
			where: { id },
			data: updateData,
		});
	}
}
