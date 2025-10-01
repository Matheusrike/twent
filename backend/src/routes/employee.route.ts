import { FastifyInstance } from 'fastify';
import { EmployeeController } from '../controller/Employee.controller.ts';

const employeeController = new EmployeeController();

export function employeeRoute(fastify: FastifyInstance) {
    fastify.post('/', employeeController.create);

    fastify.get('/', employeeController.get);
}

