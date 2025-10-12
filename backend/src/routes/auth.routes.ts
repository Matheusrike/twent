import { AuthController } from '@/controllers/Auth.controller';
import { fastifyTypedInstance } from '@/types/types';
import { AuthService } from '@/services/Auth.service';
import {
	loginBodySchema,
	InvalidPasswordResponseSchema,
	LoginSuccessResponseSchema,
	UserInactiveResponseSchema,
	UserNotFoundResponseSchema,
	LogoutSuccessResponseSchema,
} from '@/schemas/auth.schema';
import prisma from '@prisma/client';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResponse } from '@/utils/api-response.util';

export async function authRoutes(app: fastifyTypedInstance) {
	const authService = new AuthService(prisma, app.jwt);
	const authController = new AuthController(authService);

	app.post(
		'/login',
		{
			schema: {
				description: 'Login de usuário',
				tags: ['Autenticação'],
				body: loginBodySchema,
				response: {
					200: LoginSuccessResponseSchema,
					400: InvalidPasswordResponseSchema,
					401: UserNotFoundResponseSchema,
					403: UserInactiveResponseSchema,
					404: UserNotFoundResponseSchema,
					500: ApiGenericErrorSchema,
				},
			},
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await authController.login(request, reply);
				response?.send(reply);
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

	app.post(
		'/logout',
		{
			preHandler: [app.authorization()],
			schema: {
				description: 'Logout de usuário',
				tags: ['Autenticação'],
				response: {
					200: LogoutSuccessResponseSchema,
					500: ApiGenericErrorSchema,
				},
			},
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await authController.logout(request, reply);
				response?.send(reply);
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

	return app;
}
