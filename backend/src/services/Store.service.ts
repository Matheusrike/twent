import { StoreQuerystring } from '@/schemas/store.schema';
import { IStoreProps, OpeningHours } from '@/types/store.types';
import { AppError } from '@/utils/errors.util';
import { generateStoreCode } from '@/utils/generate-store-code.util';
import { PrismaClient } from '@prisma/generated/client';

export class StoreService {
	constructor(private database: PrismaClient) {}

	private async validateStore(email?: string, street?: string) {
		if (email) {
			const emailExists = await this.database.store.findFirst({
				where: { email },
			});
			if (emailExists) {
				throw new AppError({
					message: 'E-mail de filial já cadastrado',
					errorCode: 'CONFLICT',
				});
			}
		}
		if (street) {
			const streetExists = await this.database.store.findFirst({
				where: { street },
			});
			if (streetExists) {
				throw new AppError({
					message: 'Endereço de filial já cadastrada',
					errorCode: 'CONFLICT',
				});
			}
		}
	}

	async get(where: StoreQuerystring, skip: number, take: number) {
		try {
			const response = await this.database.store.findMany({
				take,
				skip,
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

	async create(storeData: IStoreProps) {
		try {
			await this.validateStore(storeData.email, storeData.street);
			const storeCode = await generateStoreCode(storeData.country);
			const prismaData = {
				...storeData,
			};
			const response = await this.database.store.create({
				data: { ...prismaData, code: storeCode },
			});

			return response;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async update(id: string, storeData: Partial<IStoreProps>) {
		try {
			await this.validateStore(storeData.email, storeData.street);

			const store = await this.database.store.findMany({
				where: { id },
			});

			if (!store) {
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
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async activateStore(id: string) {
		try {
			const response = await this.database.store.update({
				where: { id },
				data: { is_active: true },
			});

			if (!response) {
				throw new AppError({
					message: 'Filial nao encontrada',
					errorCode: 'NOT_FOUND',
				});
			}
			return response;
		} catch (error) {
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

			if (!response) {
				throw new AppError({
					message: 'Filial nao encontrada',
					errorCode: 'NOT_FOUND',
				});
			}
			return response;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}
}
