import { FastifyReply, FastifyRequest } from 'fastify';
import { CustomerController } from '@/controllers/Customer.controller';
import { CustomerService } from '@/services/Customer.service';
import { ApiResponse } from '@/utils/api-response.util';
import { fastifyTypedInstance } from '@/types/types';
import prisma from '@prisma/client';
import { createCustomerSchema, CustomerBadGatewaySchema, CustomerBadRequestSchema, CustomerGatewayTimeoutSchema, CustomerGetResponseSchema, CustomerPostResponseSchema, CustomerPutResponseSchema, customerQuerystringSchema } from '@/schemas/customer.schema';
import { UnauthorizedUserResponseSchema, UserNotFoundResponseSchema } from '@/schemas/auth.schema';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';
import { ConflictStatusResponseSchema } from '@/schemas/user.schema';

export function customerRoute(fastify: fastifyTypedInstance) {
	const customerService = new CustomerService(prisma);
	const customerController = new CustomerController(customerService);

	fastify.get(
		'/',
		{
			schema: {
				tags: ['Customer'],
				summary: 'Busca todos os clientes',
				description:
					'Faz busca de todos os clientes, com ou sem filtros',
				querystring: customerQuerystringSchema,
				response: {
					200: CustomerGetResponseSchema,
					404: UserNotFoundResponseSchema,
					401: UnauthorizedUserResponseSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: fastify.authorization({
				requiredRoles: [
					'ADMIN',
					'MANAGER_HQ',
					'EMPLOYEE_HQ',
					'MANAGER_BRANCH',
					'EMPLOYEE_BRANCH',
				],
			}),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const reponse = await customerController.getCustomers(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Clientes encontrados',
					data: reponse,
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

	fastify.post(
		'/',
		{
			schema: {
				tags: ['Customer'],
				summary: 'Cria um novo cliente',
			    body: createCustomerSchema,
				response: {
					201: CustomerPostResponseSchema,
					400: CustomerBadRequestSchema,
					401: UnauthorizedUserResponseSchema,
					409: ConflictStatusResponseSchema,
					500: ApiGenericErrorSchema,
					502: CustomerBadGatewaySchema,
					504: CustomerGatewayTimeoutSchema,
				},
			},
			preHandler: fastify.authorization({
				requiredRoles: [
					'ADMIN',
					'MANAGER_HQ',
					'EMPLOYEE_HQ',
					'MANAGER_BRANCH',
					'EMPLOYEE_BRANCH',
				],
			}),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const reponse =
					await customerController.createCustomer(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Cliente criado com sucesso',
					data: reponse,
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

	fastify.put(
		'/:id',
		{
			schema: {
				tags: ['Customer'],
				summary: 'Atualiza as informações de um cliente',
			    body: createCustomerSchema.partial(),
				response: {
					200: CustomerPutResponseSchema,
					400: CustomerBadRequestSchema,
					401: UnauthorizedUserResponseSchema,
					404: UserNotFoundResponseSchema,
					500: ApiGenericErrorSchema,
					502: CustomerBadGatewaySchema,
					504: CustomerGatewayTimeoutSchema,
				},
			},
			preHandler: fastify.authorization({
				requiredRoles: ['ADMIN'],
			}),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await customerController.updateCustomer(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Cliente atualizado com sucesso',
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
}
