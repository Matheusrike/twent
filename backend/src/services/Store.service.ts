import prisma from '@prisma/client';
import {
	IStoreProps,
	OpeningHours,
	TypeGetStoreProps,
} from '@/types/store.types';
import { AppError } from '@/utils/errors.util';
import { generateStoreCode } from '@/utils/generate-store-code.util';

export class StoreService {
	private async validateStore(email?: string, street?: string) {
		if (email) {
			const emailExists = await prisma.store.findFirst({
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
			const streetExists = await prisma.store.findFirst({
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

	async get(where?: TypeGetStoreProps, skip = 0, take = 10) {
  
		const response = await prisma.store.findMany({
			take: Number(take) || 10,
			skip: Number(skip) || 0,
			where,
		});

		return response;
	}

	async create(storeData: IStoreProps) {
		await this.validateStore(storeData.email, storeData.street);
		const storeCode = await generateStoreCode(storeData.country);
		const prismaData = {
			...storeData,
		};
		const response = await prisma.store.create({
			data: { ...prismaData, code: storeCode },
		});

		return response;
	}

	async update(id: string, storeData: Partial<IStoreProps>) {
		await this.validateStore(storeData.email, storeData.street);

		const store = await this.get({ id } as TypeGetStoreProps);
        
		if (!store || store.length === 0) {
			throw new AppError({
				message: 'Filial não encontrada',
				errorCode: 'NOT_FOUND',
			});
		}

		const currentData = store[0];

		if (storeData.opening_hours) {
			const currentOpeningHours = Array.isArray(currentData.opening_hours)
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
		const response = await prisma.store.update({
			where: { id },
			data: storeData,
		});

		return response;
	}

	async changeStatus(id: string, newStatus: boolean) {
		const store = await this.get({ id } as TypeGetStoreProps);
		if (!store || store.length === 0) {
			throw new AppError({
				message: 'Filial não encontrada',
				errorCode: 'NOT_FOUND',
			});
		}
		if (newStatus === store[0].is_active) {
			throw new AppError({
				message:
					newStatus === true
						? 'Filial já ativa'
						: 'Filial já inativa',
				errorCode: 'BAD_REQUEST',
			});
		}
		const response = await prisma.store.update({
			where: { id },
			data: { is_active: newStatus },
		});
		return response;
	}
}
