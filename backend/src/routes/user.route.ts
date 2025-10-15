import type { fastifyTypedInstance } from '@/types/types';
import { UserController } from '@/controllers/User.controller';
import { UserService } from '@/services/User.service';
import { UserResponseSchema } from '@/schemas/user.schema';
import { UserNotFoundResponseSchema } from '@/schemas/auth.schema';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiResponse } from '@/utils/api-response.util';

export function userRoute(fastify: fastifyTypedInstance) {
	const userService = new UserService();
	const userController = new UserController(userService);

	fastify.get<{ Querystring: { id: string }}>(
		'/profile',
		{
			schema: {
				tags: ['User'],
				summary: 'Busca o perfil de um usuário',
				response: {
					200: UserResponseSchema,
                    404: UserNotFoundResponseSchema,
                    500: ApiGenericErrorSchema,
				},
			},
			preHandler: fastify.authorization(),
		},
        async (request: FastifyRequest<{Querystring: {id: string}}>, reply: FastifyReply) => {
            try {
                const reponse =  await userController.getInfo(request, reply);
                return reponse;
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

    // TODO: finalizar documentação da rota
	fastify.put<{ Params: { id: string }; Body: { newStatus: boolean } }>(
		'/:id/status',
		{
            schema: {
                tags: ['User'],
                description: 'Altera o status de um usuário',
                body: {
                    newStatus: 'boolean',
                },
                params: {
                    id: 'string',
                    required: ['id'],
                }
            },
			preHandler: fastify.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ', 'MANAGER_BRANCH'],
			}),
		},
		userController.changeStatus.bind(userController),
	);
}
