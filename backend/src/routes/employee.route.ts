import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { EmployeeController } from '@/controllers/Employee.controller';
import { EmployeeService } from '@/services/Employee.service';
import { ApiResponse } from '@/utils/api-response.util';
import { IEmployeeProps } from '@/types/users.types';
import {
	EmployeeBadRequestSchema,
	EmployeeBodySchema,
	EmployeeGetResponseSchema,
	EmployeePostResponseSchema,
	EmployeePutResponseSchema,
} from '@/schemas/employee.schema';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';
import {
	CustomerBadGatewaySchema,
	CustomerGatewayTimeoutSchema,
} from '@/schemas/customer.schema';
import { UnauthorizedUserResponseSchema } from '@/schemas/auth.schema';
import { EmployeeQuerystringSchema } from '@/schemas/employee.schema';

export function employeeRoute(fastify: FastifyInstance) {
	const employeeService = new EmployeeService();
	const employeeController = new EmployeeController(employeeService);

	fastify.post<{
		Body: { data: IEmployeeProps };
	}>(
		'/',
		{
			schema: {
				tags: ['Employee'],
				summary: 'Cria um novo funcionário',
				description: 'Cria um novo funcionário',
                body: EmployeeBodySchema,
				response: {
					201: EmployeePostResponseSchema,
					400: EmployeeBadRequestSchema,
					401: UnauthorizedUserResponseSchema,
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
				Body: { data: IEmployeeProps };
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

	fastify.get(
		'/',
		{
			schema: {
				tags: ['Employee'],
				summary: 'Busca todos os funcionários',
				description: 'Busca todos os funcionários, com ou sem filtros',
                querystring: EmployeeQuerystringSchema,
				response: {
					200: EmployeeGetResponseSchema,
					400: EmployeeBadRequestSchema,
					401: UnauthorizedUserResponseSchema,
					500: ApiGenericErrorSchema,
					502: CustomerBadGatewaySchema,
					504: CustomerGatewayTimeoutSchema,
				},
			},
			preHandler: fastify.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ', 'MANAGER_BRANCH'],
			}),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await employeeController.get(request, reply);
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

	fastify.put<{
		Params: { id: string };
		Body: { data: IEmployeeProps };
	}>(
		'/:id',
		{
			schema: {
				tags: ['Employee'],
				summary: 'Atualiza um funcionário',
				description: 'Atualiza um funcionário',
                body: EmployeeBodySchema.partial(),
				response: {
					200: EmployeePutResponseSchema,
					400: EmployeeBadRequestSchema,
					401: UnauthorizedUserResponseSchema,
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
				Params: { id: string };
				Body: { data: IEmployeeProps };
			}>,
			reply: FastifyReply,
		) => {
			try {
				const response = await employeeController.update(
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
}
