import { FastifyReply, FastifyRequest } from 'fastify';
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
import { ApiResponse } from '@/utils/api-response.util';
import { fastifyTypedInstance } from '@/types/types';

export function customerRoute(fastify: fastifyTypedInstance) {
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
     	async (
			request: FastifyRequest,
			reply: FastifyReply,
		) => {
			try {
				const reponse = await customerController.get(request, reply);
				return reponse;
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
		async (
            request: FastifyRequest,
            reply: FastifyReply,
        ) => {
            try {
                const reponse = await customerController.create(request, reply);
                return reponse;
            } catch (error) {
                return new ApiResponse({
                    success: false,
                    statusCode: error.statusCode,
                    message: error.message,
                    errorCode: error.errorCode
                }).send(reply);
            }
        }
	);

	fastify.put<{Params: {id: string}}>(
        '/:id', 
        {
            schema: {
               tags: ['Customer'],
               summary: 'Atualiza as informações de um cliente',
               body:  UserSchema.partial(),
            },
            preHandler: fastify.authorization({
                    requiredRoles: ['ADMIN']
                
            }),
        }, 
        async (
        request: FastifyRequest<{Params: {id: string}}>,
        reply: FastifyReply,
        ) => { 
            try {
                const response = await customerController.update(request, reply);
                return response
            } catch (error) {
                return new ApiResponse({
                    success: false,
                    statusCode: error.statusCode,
                    message: error.message,
                    errorCode: error.errorCode
                }).send(reply)
            }
        }
    );
}
