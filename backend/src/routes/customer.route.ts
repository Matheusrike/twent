import { FastifyInstance } from 'fastify';
import { CustomerController } from '@/controllers/Customer.controller';
import { CustomerService } from '@/services/Customer.service';

export function customerRoute(fastify: FastifyInstance) {
	const customerService = new CustomerService();
	const customerController = new CustomerController(customerService);

	fastify.get('/', customerController.get.bind(customerController));

	fastify.post('/', customerController.create.bind(customerController));

	fastify.put('/:id', customerController.update.bind(customerController));
}
