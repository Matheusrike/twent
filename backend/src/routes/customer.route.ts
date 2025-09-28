import { FastifyInstance } from 'fastify';
import { CustomerController } from '../controller/Customer.controller.ts';

const customerController = new CustomerController();

export function customerRoute(fastify: FastifyInstance) {
	fastify.get('/customer', customerController.get);

	fastify.post('/customer', customerController.create);

	fastify.put('/customer/:id', customerController.update);

}
