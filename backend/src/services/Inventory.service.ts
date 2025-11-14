import {
	CreateInventoryType,
	InventoryAddRemoveType,
	InventoryTransactionType,
} from '@/schemas/inventory.schema';
import { AppError } from '@/utils/errors.util';
import { PrismaClient } from '@prisma/generated/client';

export class InventoryService {
	constructor(private database: PrismaClient) {}

	async getAllInventorys() {
		const inventory = await this.database.inventory.findMany({
			select: {
				store: {
					select: {
						name: true,
						email: true,
					},
				},
				quantity: true,
				minimum_stock: true,
				product: {
					select: {
						name: true,
						description: true,
						price: true,
					},
				},
			},
		});
		return inventory;
	}

	async getStoreInventorys(storeId: string) {
		const inventory = await this.database.inventory.findMany({
			where: {
				store_id: storeId,
			},
			select: {
				id: true,
				product: {
					select: {
                        sku: true,
						name: true,
						description: true,
						price: true,
					},
				},
				quantity: true,
				minimum_stock: true,
			},
		});
		return inventory;
	}

	async newInventory(data: CreateInventoryType) {
		try {
            
			// if (data.quantity < data.minimum_stock) {
			// 	throw new AppError({
			// 		message: 'Quantidade abaixo do estoque mínimo',
			// 		errorCode: 'BAD_REQUEST',
			// 	});
			// }
			const inventory = await this.database.inventory.create({ data });
			return inventory;
		} catch (error) {
			if (error.code === 'P2002') {
				throw new AppError({
					message: 'Item conflitante no inventário',
					errorCode: 'CONFLICT',
				});
			}
			throw new AppError({
				message: error.message,
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async addToInventory({ id, quantity }: InventoryAddRemoveType) {
		try {
			const inventoryItem = await this.database.inventory.findUnique({
				where: {
					id,
				},
			});
			if (!inventoryItem) {
				throw new AppError({
					message: 'Inventário do produto não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}
			const updatedInventory = await this.database.inventory.update({
				where: {
					id,
				},
				data: {
					quantity: inventoryItem.quantity + quantity,
				},
			});
			return updatedInventory;
		} catch (error) {
			if (error instanceof AppError) {
				throw new AppError({
					message: error.message,
					errorCode: error.errorCode,
				});
			}
			throw new AppError({
				message: error.message,
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async removeFromInventory(id: string, quantity: number) {
		try {
			const inventoryItem = await this.database.inventory.findFirst({
				where: {
					id,
				},
			});
			if (!inventoryItem) {
				throw new AppError({
					message: 'Item não encontrado no inventário',
					errorCode: 'NOT_FOUND',
				});
			}
			if (inventoryItem.quantity < quantity) {
				throw new AppError({
					message: 'Quantidade insuficiente no inventário',
					errorCode: 'BAD_REQUEST',
				});
			}
			const updatedInventory = await this.database.inventory.update({
				where: {
					id: inventoryItem.id,
				},
				data: {
					quantity: inventoryItem.quantity - quantity,
				},
			});
			return updatedInventory;
		} catch (error) {
			if (error instanceof AppError) {
				throw new AppError({
					message: error.message,
					errorCode: error.errorCode,
				});
			}
			throw new AppError({
				message: error.message,
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async transferInventory({
		fromStoreId,
		toStoreId,
		productId,
		quantity,
	}: InventoryTransactionType) {
		try {
			const fromInventory = await this.database.inventory.findFirst({
				where: {
					store_id: fromStoreId,
                    product_id: productId,
				},
			});
			if (!fromInventory) {
				throw new AppError({
					message: 'Inventário de origem não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}
			if (fromInventory.quantity < quantity) {
				throw new AppError({
					message: 'Quantidade insuficiente no inventário de origem',
					errorCode: 'BAD_REQUEST',
				});
			}
			const toInventory = await this.database.inventory.findFirst({
				where: {
					store_id: toStoreId,
					product_id: productId,
				},
			});
			if (!toInventory) {
				throw new AppError({
					message: 'Inventário de destino não encontrado',
					errorCode: 'NOT_FOUND',
				});
			}
			const updatedInventorys = await this.database.$transaction(
				async (tx) => {
					const updatedFromInventory = await tx.inventory.update({
						where: { id: fromInventory.id },
						data: {
							quantity: fromInventory.quantity - quantity,
						},
					});
					const updatedToInventory = await tx.inventory.update({
						where: { id: toInventory.id },
						data: {
							quantity: toInventory.quantity + quantity,
						},
					});
					return { updatedFromInventory, updatedToInventory };
				},
			);
			return updatedInventorys;
		} catch (error) {
			if (error instanceof AppError) {
				throw new AppError({
					message: error.message,
					errorCode: error.errorCode,
				});
			}
			throw new AppError({
				message: error.message,
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}
}
