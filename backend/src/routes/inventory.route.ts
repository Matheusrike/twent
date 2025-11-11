import { fastifyTypedInstance } from '@/types/types';
import { InventoryController } from '@/controllers/Inventory.controller';
import { InventoryService } from '@/services/Inventory.service';
import prisma from '@prisma/client';
import { ApiResponse } from '@/utils/api-response.util';
import { HttpError } from '@/utils/errors.util';

export async function inventoryRoutes(app: fastifyTypedInstance) {
	const inventoryService = new InventoryService(prisma);
	const inventoryController = new InventoryController(inventoryService);

	app.get(
		'/all',
		{
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request, reply) => {
			try {
				const inventory = await inventoryController.getAllInventorys();
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Inventário listado com sucesso',
					data: inventory,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.get(
		'/store',
		{
			preHandler: [
				app.authorization({
					requiredRoles: ['ADMIN', 'STORE_MANAGER'],
				}),
			],
		},
		async (request, reply) => {
			try {
				const inventory =
					await inventoryController.getStoreInventorys(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Inventário da loja listado com sucesso',
					data: inventory,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.post(
		'/',
		{ preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })] },
		async (request, reply) => {
			try {
				const newInventory =
					await inventoryController.newInventory(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Inventário criado com sucesso',
					data: newInventory,
				}).send(reply);
			} catch (error) {
				console.log(error);
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.patch('/add/:inventoryId', async (request, reply) => {
		try {
			const updatedInventory =
				await inventoryController.addToInventory(request);
			return new ApiResponse({
				statusCode: 200,
				success: true,
				message: 'Inventário atualizado com sucesso',
				data: updatedInventory,
			}).send(reply);
		} catch (error) {
			if (error instanceof HttpError) {
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		}
	});

	app.patch('/remove/:inventoryId', async (request, reply) => {
		try {
			const updatedInventory =
				await inventoryController.removeFromInventory(request);
			return new ApiResponse({
				statusCode: 200,
				success: true,
				message: 'Inventário atualizado com sucesso',
				data: updatedInventory,
			}).send(reply);
		} catch (error) {
			if (error instanceof HttpError) {
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		}
	});

	app.patch(
		'/transaction/:productId',
		{ preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })] },
		async (request, reply) => {
			try {
				const updatedInventory =
					await inventoryController.transferInventory(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Transação de inventário realizada com sucesso',
					data: updatedInventory,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);
}
