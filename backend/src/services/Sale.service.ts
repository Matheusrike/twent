import { NewSale } from '@/schemas/sale.schema';
import { AppError } from '@/utils/errors.util';
import { PrismaClient } from '@prisma/generated/client';

export class SaleService {
	constructor(private database: PrismaClient) {}

	async newSale(data: NewSale) {
		try {
			const response = await this.database.sale.create({
				data,
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
