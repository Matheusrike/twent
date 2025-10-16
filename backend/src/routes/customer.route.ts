import { FastifyInstance } from 'fastify';
import { CustomerController } from '@/controllers/Customer.controller';
import { CustomerService } from '@/services/Customer.service';
import {
    CustomerBadGatewaySchema,
    CustomerBadRequestSchema,
	CustomerConflictSchema,
	CustomerGatewayTimeoutSchema,
	CustomerGetResponseSchema,
	CustomerPostResponseSchema,
	CustomerQueystringSchema,
} from '@/schemas/customer.schema';
import { UserNotFoundResponseSchema } from '@/schemas/auth.schema';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';
import { UserSchema } from '@/schemas/user.schema';

export function customerRoute(fastify: FastifyInstance) {
	const customerService = new CustomerService();
	const customerController = new CustomerController(customerService);

	fastify.get(
		'/',
		{
			schema: {
				tags: ['Customer'],
				summary: 'Busca todos os clientes',
				description:
					'Faz busca de todos os clientes, com ou sem filtros',
				querystring: CustomerQueystringSchema,
				response: {
					200: CustomerGetResponseSchema,
					404: UserNotFoundResponseSchema,
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
		customerController.get.bind(customerController),
	);

	fastify.post(
		'/',
		{
            schema:{
                tags: ['Customer'],
                summary: 'Cria um novo cliente',
                body: UserSchema,
                response: {
                    201: CustomerPostResponseSchema,
                    400: CustomerBadRequestSchema,
                    409: CustomerConflictSchema,
                    500: ApiGenericErrorSchema,
                    502: CustomerBadGatewaySchema,
                    504: CustomerGatewayTimeoutSchema
                }
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
		customerController.create.bind(customerController),
	);

	fastify.put('/:id', customerController.update.bind(customerController));
}
