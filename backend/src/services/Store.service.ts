import prisma from '../../prisma/client.ts';
import { IStoreProps } from '../types/store.types.ts';

export class StoreService {
	async get() {
		const response = await prisma.store.findMany({});

		return {
			...response,
		};
	}

	async create(storeData: IStoreProps) {
    const prismaData = {
        ...storeData,
        opening_hours: storeData.opening_hours ? JSON.stringify(storeData.opening_hours) : undefined,
    };
    const response = await prisma.store.create({ data: prismaData });

    return response;
}
}
