import { FastifyInstance } from 'fastify';
import { CustomerController } from '../controllers/Customer.controller.ts';
import { CustomerService } from '@/services/Customer.service.ts';

export function customerRoute(fastify: FastifyInstance) {
	const customerService = new CustomerService();
	const customerController = new CustomerController(customerService);

	fastify.get('/', customerController.get.bind(customerController));

	fastify.post('/', customerController.create.bind(customerController));

	fastify.put('/:id', customerController.update.bind(customerController));
}
