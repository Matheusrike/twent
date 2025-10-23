import { FastifyReply, FastifyRequest } from 'fastify';
import { StoreService } from '@/services/Store.service';
import { StoreController } from '@/controllers/Store.controller';
import { fastifyTypedInstance } from '@/types/types';
import { ApiResponse } from '@/utils/api-response.util';
import { StoreGetResponseSchema } from '@/schemas/store.schema';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';

export function storeRoute(fastify: fastifyTypedInstance) {
	const storeService = new StoreService();
	const storeController = new StoreController(storeService);

	fastify.get(
		'/',
		{
			schema: {
				tags: ['Store'],
				summary: 'Busca todos as lojas',
				description: 'Faz busca de todas as lojas, com ou sem filtros',
				response: {
					200: StoreGetResponseSchema,
                    500: ApiGenericErrorSchema
				},
			},
			preHandler: fastify.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ', 'MANAGER_BRANCH'],
			}),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await storeController.get(request, reply);
				return response;
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);
	fastify.post('/', storeController.create.bind(storeController));
	fastify.put('/:id', storeController.update.bind(storeController));
	fastify.patch('/:id', storeController.changeStatus.bind(storeController));
}
