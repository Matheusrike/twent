import { FastifyInstance } from 'fastify';
import { StoreController } from '../controllers/Store.controller.ts';

export function storeRoute(fastify: FastifyInstance) {
    const storeController = new StoreController();
    fastify.get('/', storeController.get);

    fastify.post('/', storeController.create);
}