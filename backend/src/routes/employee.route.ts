import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { EmployeeController } from '@/controllers/Employee.controller';
import { EmployeeService } from '@/services/Employee.service';
import { ApiResponse } from '@/utils/api-response.util';
import { IEmployeeProps, IUser } from '@/types/users.types';
import {
	EmployeeBadRequestSchema,
	EmployeePostResponseSchema,
} from '@/schemas/employee.schema';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';
import { CustomerBadGatewaySchema, CustomerGatewayTimeoutSchema } from '@/schemas/customer.schema';

export function employeeRoute(fastify: FastifyInstance) {
	const employeeService = new EmployeeService();
	const employeeController = new EmployeeController(employeeService);

	fastify.post<{
		Body: { userData: IUser; employeeData: IEmployeeProps };
		Headers: { 'x-role-name': string; 'x-store-code': string };
	}>(
		'/',
		{
			//TODO: documentar
			schema: {
				tags: ['Employee'],
				summary: 'Cria um novo funcionário',
				description: 'Cria um novo funcionário',
				response: {
					201: EmployeePostResponseSchema,
					400: EmployeeBadRequestSchema,
					500: ApiGenericErrorSchema,
					502: CustomerBadGatewaySchema,
					504: CustomerGatewayTimeoutSchema,
				},
			},
			preHandler: fastify.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ', 'MANAGER_BRANCH'],
			}),
		},
		async (
			request: FastifyRequest<{
				Body: { userData: IUser; employeeData: IEmployeeProps };
				Headers: { 'x-role-name': string; 'x-store-code': string };
			}>,
			reply: FastifyReply,
		) => {
			try {
				const response = await employeeController.create(
					request,
					reply,
				);
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

	fastify.get('/', employeeController.get.bind(employeeController));

	fastify.put('/:id', employeeController.update.bind(employeeController));
}
