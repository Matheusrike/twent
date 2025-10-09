import { FastifyInstance } from 'fastify';
import { EmployeeController } from '../controllers/Employee.controller.ts';

const employeeController = new EmployeeController();

export function employeeRoute(fastify: FastifyInstance) {
	fastify.post('/', employeeController.create);

	fastify.get('/', employeeController.get);

    fastify.put('/:id', employeeController.update);
}
