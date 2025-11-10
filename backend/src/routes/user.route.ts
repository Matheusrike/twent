import type { fastifyTypedInstance } from '@/types/types';
import { UserController } from '@/controllers/User.controller';
import { UserService } from '@/services/User.service';
import {
	ChangeStatusBodySchema,
	ChangeStatusResponseSchema,
	ConflictStatusResponseSchema,
	UserGetResponseSchema,
} from '@/schemas/user.schema';
import {
	UnauthorizedUserResponseSchema,
	UserNotFoundResponseSchema,
} from '@/schemas/auth.schema';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiResponse } from '@/utils/api-response.util';
import prisma from '@prisma/client';

export function userRoute(app: fastifyTypedInstance) {
	const userService = new UserService(prisma);
	const userController = new UserController(userService);

	app.get<{ Querystring: { id: string } }>(
		'/profile',
		{
			schema: {
				tags: ['User'],
				summary: 'Busca o perfil de um usuário',
				response: {
					200: UserGetResponseSchema,
					404: UserNotFoundResponseSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization(),
		},
		async (
			request: FastifyRequest<{ Querystring: { id: string } }>,
			reply: FastifyReply,
		) => {
			try {
				const response = await userController.getInfo(request);
				console.log(response);

				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Informação(ões) do(s) usuário(s) encontrada(s)',
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

	app.patch(
		'/activate/:id',
		{
			preHandler: app.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ', 'MANAGER_BRANCH'],
			}),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await userController.activateUser(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Usuário ativado com sucesso',
					data: response,
				});
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
	app.patch(
		'/deactivate/:id',
		{
			preHandler: app.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ', 'MANAGER_BRANCH'],
			}),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await userController.deactivateUser(request);
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
