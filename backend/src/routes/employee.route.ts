import { FastifyInstance } from 'fastify';
import { EmployeeController } from '../controllers/Employee.controller.ts';
import { EmployeeService } from '@/services/Employee.service.ts';

export function employeeRoute(fastify: FastifyInstance) {
    const employeeService = new EmployeeService();
    const employeeController =  new EmployeeController(employeeService);

	fastify.post('/', employeeController.create.bind(employeeController));

	fastify.get('/', employeeController.get.bind(employeeController));

    fastify.put('/:id', employeeController.update.bind(employeeController));
}
