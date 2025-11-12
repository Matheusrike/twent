import { FastifyReply, FastifyRequest } from 'fastify';
import { EmployeeController } from '@/controllers/Employee.controller';
import { EmployeeService } from '@/services/Employee.service';
import { ApiResponse } from '@/utils/api-response.util';
import prisma from '@prisma/client';
import { fastifyTypedInstance } from '@/types/types';
import { createEmployeeSchema, EmployeeBadRequestSchema, EmployeeGetResponseSchema, EmployeePostResponseSchema, EmployeePutResponseSchema, employeeQuerystringSchema } from '@/schemas/employee.schema';
import { UnauthorizedUserResponseSchema } from '@/schemas/auth.schema';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';
import { CustomerBadGatewaySchema, CustomerGatewayTimeoutSchema } from '@/schemas/customer.schema';

export function employeeRoute(app: fastifyTypedInstance) {
	const employeeService = new EmployeeService(prisma);
	const employeeController = new EmployeeController(employeeService);

	app.post(
		'/',
		{
			schema: {
				tags: ['Employee'],
				summary: 'Cria um novo funcionário',
				description: 'Cria um novo funcionário',
			    body: createEmployeeSchema,
				response: {
					201: EmployeePostResponseSchema,
					400: EmployeeBadRequestSchema,
					401: UnauthorizedUserResponseSchema,
					500: ApiGenericErrorSchema,
					502: CustomerBadGatewaySchema,
					504: CustomerGatewayTimeoutSchema,
				},
			},
			preHandler: app.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ', 'MANAGER_BRANCH'],
			}),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await employeeController.createEmployee(request);
                    const payload =  new ApiResponse({
                        statusCode: 201,
                        success: true,
                        message: 'Funcionario criado com sucesso',
                        data: response,
                    })
                    const parse =  EmployeePostResponseSchema.safeParse(payload);
                    if (!parse.success) {
                        console.log(parse.error)
                    }
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Funcionario criado com sucesso',
					data: response,
				}).send(reply);
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

	app.get(
		'/',
		{
			schema: {
				tags: ['Employee'],
				summary: 'Busca todos os funcionários',
				description: 'Busca todos os funcionários, com ou sem filtros',
			    querystring: employeeQuerystringSchema,
				response: {
					200: EmployeeGetResponseSchema,
					400: EmployeeBadRequestSchema,
					401: UnauthorizedUserResponseSchema,
					500: ApiGenericErrorSchema,
					502: CustomerBadGatewaySchema,
					504: CustomerGatewayTimeoutSchema,
				},
			},
			preHandler: app.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ', 'MANAGER_BRANCH'],
			}),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await employeeController.getEmployee(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Funcionarios encontrados com sucesso',
					data: response,
				}).send(reply);;
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

	app.put(
		'/:id',
		{
			schema: {
				tags: ['Employee'],
				summary: 'Atualiza um funcionário',
				description: 'Atualiza um funcionário',
			    body: createEmployeeSchema.partial(),
				response: {
					200: EmployeePutResponseSchema,
					400: EmployeeBadRequestSchema,
					401: UnauthorizedUserResponseSchema,
					500: ApiGenericErrorSchema,
					502: CustomerBadGatewaySchema,
					504: CustomerGatewayTimeoutSchema,
				},
			},
			preHandler: app.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ', 'MANAGER_BRANCH'],
			}),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await employeeController.updateEmployee(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Funcionario atualizado com sucesso',
					data: response,
				}).send(reply);;
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
