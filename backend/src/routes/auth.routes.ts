import { AuthController } from '@/controllers/auth.controller';
import { fastifyTypedInstance } from '@/types/types';
import { AuthService } from '@/services/Auth.service';
import {
	loginBodySchema,
	InvalidPasswordResponseSchema,
	LoginSuccessResponseSchema,
	UserInactiveResponseSchema,
	UserNotFoundResponseSchema,
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
				tags: ['Auth'],
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

	return app;
}
