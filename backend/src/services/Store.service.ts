import { CreateStore, StoreQuerystring } from '@/schemas/store.schema';
import { OpeningHours } from '@/types/store.types';
import { AppError } from '@/utils/errors.util';
import { generateStoreCode } from '@/utils/generate-store-code.util';
import { PrismaClient } from '@prisma/generated/client';

export class StoreService {
	constructor(private database: PrismaClient) {}

	async get(where: StoreQuerystring, skip: number, take: number) {
		try {
			const response = await this.database.store.findMany({
				take: take || 10,
				skip: skip || 0,
				where,
			});

			return response;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async create(storeData: CreateStore) {
		try {
			const storeCode = await generateStoreCode(storeData.country);
			console.log(storeCode);

			const response = await this.database.store.create({
				data: { ...storeData, code: storeCode },
			});
			console.log(response);

			return response;
		} catch (error) {
			console.log(error.meta);
			if (error.code === 'P2002') {
				throw new AppError({
					message: 'Dados conflitantes: ' + error.meta.target,
					errorCode: 'CONFLICT',
				});
			}
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async update(id: string, storeData: Partial<CreateStore>) {
		try {
			const store = await this.database.store.findMany({
				where: { id },
			});

			if (store.length === 0) {
				throw new AppError({
					message: 'Filial não encontrada',
					errorCode: 'NOT_FOUND',
				});
			}

			const currentData = store[0];

			if (storeData.opening_hours) {
				const currentOpeningHours = Array.isArray(
					currentData.opening_hours,
				)
					? (currentData.opening_hours as OpeningHours[])
					: [];

				const openingHoursMap: Record<string, OpeningHours> = {};

				for (const item of currentOpeningHours) {
					if (item?.day) openingHoursMap[item.day] = item;
				}

				for (const newDay of storeData.opening_hours as OpeningHours[]) {
					if (newDay?.day) openingHoursMap[newDay.day] = newDay;
				}

				storeData.opening_hours = Object.values(openingHoursMap);
			}
			const response = await this.database.store.update({
				where: { id },
				data: storeData,
			});

			return response;
		} catch (error) {
			switch (error.code) {
				case 'P2002':
					throw new AppError({
						message: 'Dados conflitantes: ' + error.meta.target,
						errorCode: 'CONFLICT',
					});
				case 'P2025':
					throw new AppError({
						message: 'Filial nao encontrada',
						errorCode: 'NOT_FOUND',
					});
				default:
					throw new AppError({
						message: error.message,
						errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
					});
			}
		}
	}

	async activateStore(id: string) {
		try {
			const response = await this.database.store.update({
				where: { id },
				data: { is_active: true },
			});

			return response;
		} catch (error) {
			if (error.code === 'P2025') {
				throw new AppError({
					message: 'Filial nao encontrada',
					errorCode: 'NOT_FOUND',
				});
			}
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async deactivateStore(id: string) {
		try {
			const response = await this.database.store.update({
				where: { id },
				data: { is_active: false },
			});

			return response;
		} catch (error) {
			if (error.code === 'P2025') {
				throw new AppError({
					message: 'Filial nao encontrada',
					errorCode: 'NOT_FOUND',
				});
			}
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}
}
