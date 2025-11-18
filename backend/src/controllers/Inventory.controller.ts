import {
	CreateInventoryType,
	InventoryAddRemoveType,
	InventoryTransactionType,
} from '@/schemas/inventory.schema';
import { InventoryService } from '@/services/Inventory.service';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { AppError, HttpError } from '@/utils/errors.util';
import { FastifyRequest } from 'fastify';

export class InventoryController {
	constructor(private inventoryService: InventoryService) {}

	async getAllInventorys() {
		try {
			const inventory = await this.inventoryService.getAllInventorys();
			return inventory;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					message: error.message,
					statusCode: 400,
					errorCode: error.errorCode,
				});
			}
			throw new HttpError({
				statusCode: 500,
				message: 'Internal server error',
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async getStoreInventorys(request: FastifyRequest) {
		try {
			const user = request.user as IJwtAuthPayload;
			const inventory = await this.inventoryService.getStoreInventorys(
				user.storeId!,
			);
			return inventory;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					message: error.message,
					statusCode: 400,
					errorCode: error.errorCode,
				});
			}
			throw new HttpError({
				statusCode: 500,
				message: 'Internal server error',
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async newInventory(request: FastifyRequest) {
		try {
			const { product_id, quantity, store_id, minimum_stock } =
				request.body as CreateInventoryType;
                

			const newInventory = await this.inventoryService.newInventory({
				product_id,
				quantity,
				store_id:
					store_id || (request.user as IJwtAuthPayload).storeId!,
				minimum_stock,
			});
			return newInventory;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'CONFLICT':
						throw new HttpError({
							message: error.message,
							statusCode: 409,
							errorCode: error.errorCode,
						});
					case 'BAD_REQUEST':
						throw new HttpError({
							message: error.message,
							statusCode: 400,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							statusCode: 500,
							message: error.message,
							errorCode: 'INTERNAL_SERVER_ERROR',
						});
				}
			}
		}
	}

	async addToInventory(request: FastifyRequest) {
		try {
			const { inventoryId } = request.params as { inventoryId: string };
			const { quantity } = request.body as InventoryAddRemoveType;
            
			const updatedInventory = await this.inventoryService.addToInventory(
				{ id: inventoryId, quantity },
			);
			return updatedInventory;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							statusCode: 500,
							message: error.message,
							errorCode: 'INTERNAL_SERVER_ERROR',
						});
				}
			}
		}
	}

	async removeFromInventory(request: FastifyRequest) {
		try {
			const { inventoryId } = request.params as { inventoryId: string };
			const { quantity } = request.body as InventoryAddRemoveType;
			const updatedInventory =
				await this.inventoryService.removeFromInventory(
					inventoryId,
					quantity,
				);
			return updatedInventory;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
							errorCode: error.errorCode,
						});
					case 'BAD_REQUEST':
						throw new HttpError({
							message: error.message,
							statusCode: 400,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							statusCode: 500,
							message: error.message,
							errorCode: 'INTERNAL_SERVER_ERROR',
						});
				}
			}
		}
	}

	async transferInventory(request: FastifyRequest) {
		try {
			const { storeId } = request.user as IJwtAuthPayload;
			if (!storeId) {
				throw new HttpError({
					message: 'Store ID is missing in token',
					statusCode: 400,
					errorCode: 'BAD_REQUEST',
				});
			}
			const { productId } = request.params as { productId: string };
			const { toStoreId, quantity } =
				request.body as InventoryTransactionType;
			const result = await this.inventoryService.transferInventory({
				fromStoreId: storeId!,
				toStoreId,
				productId,
				quantity,
			});
			return result;
		} catch (error) {
            console.log(error);
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
							errorCode: error.errorCode,
						});
					case 'BAD_REQUEST':
						throw new HttpError({
							message: error.message,
							statusCode: 400,
							errorCode: error.errorCode,
						});
					default:
						throw new HttpError({
							statusCode: 500,
							message: error.message,
							errorCode: 'INTERNAL_SERVER_ERROR',
						});
				}
			}
		}
	}
}
