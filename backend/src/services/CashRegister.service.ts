import { AppError } from '@/utils/errors.util';
import { PrismaClient } from '@prisma/generated/client';

export class CashRegisterService {
	constructor(private database: PrismaClient) {}

	async getCashRegisters(storeId: string) {
		try {
			const response = await this.database.cashRegister.findMany({
				where: { store_id: storeId },
			});
			return response;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async newCashRegister(store_id: string) {
		try {
			const existingCashRegister =
				await this.database.cashRegister.findMany({
					where: { store_id },
				});

			const response = await this.database.cashRegister.create({
				data: {
					store_id,
					name: `CR_${existingCashRegister.length + 1}`,
				},
			});
			return response;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async activateCashRegister(id: string) {
		try {
			const response = await this.database.cashRegister.update({
				where: { id },
				data: { is_active: true },
			});
			return response;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}
	async deactivateCashRegister(id: string) {
		try {
			const response = await this.database.cashRegister.update({
				where: { id },
				data: { is_active: false },
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
