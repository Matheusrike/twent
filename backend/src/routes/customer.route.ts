import { FastifyInstance } from 'fastify';
import { CustomerController } from '../controllers/Customer.controller.ts';

const customerController = new CustomerController();

export function customerRoute(fastify: FastifyInstance) {
	fastify.get('/', customerController.get);

	fastify.post('/', customerController.create);

	fastify.put('/:id', customerController.update);
}
