import prisma from '../../prisma/client.ts';
import {
	IStoreProps,
	OpeningHours,
	TypeGetStoreProps,
} from '../types/store.types.ts';
import { AppError } from '../utils/errors.util.ts';
import { generateStoreCode } from '../utils/generate-store-code.util.ts';

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
	async get(where?: TypeGetStoreProps) {
		const response = await prisma.store.findMany({ where: where });

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

		const store = await this.get({ id });
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
        const store = await this.get({id})
        if (!store || store.length === 0) {
            throw new AppError({
                message: 'Filial não encontrada',
                errorCode: 'NOT_FOUND',
            })
        }
        if(newStatus === store[0].is_active) {
            throw new AppError({
                message: newStatus === true
						? 'Filial já ativa'
						: 'Filial já inativa',
                errorCode: 'BAD_REQUEST',
            })
        }
        const response = await prisma.store.update({where: {id}, data: {is_active: newStatus}})
        return response
    }
}
