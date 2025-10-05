import prisma from '../../prisma/client.ts';
import { IStoreProps } from '../types/store.types.ts';
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
	async get() {
		const response = await prisma.store.findMany({});

		return {
			...response,
		};
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
        const response = await prisma.store.update({
            where: { id },
            data: storeData
        });
        return response;
    }
}
