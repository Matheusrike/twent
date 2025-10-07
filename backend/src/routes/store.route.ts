import { FastifyInstance } from 'fastify';
import { StoreService } from '@/services/Store.service';
import { StoreController } from '@/controllers/Store.controller';

export function storeRoute(fastify: FastifyInstance) {
	const storeService = new StoreService();
	const storeController = new StoreController(storeService);

	fastify.get('/', storeController.get.bind(storeController));
	fastify.post('/', storeController.create.bind(storeController));
	fastify.put('/:id', storeController.update.bind(storeController));
}
