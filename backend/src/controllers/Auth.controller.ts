import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '@/services/Auth.service';
import { ApiResponse } from '@/utils/api-response.util';
import { AppError, HttpError } from '@/utils/errors.util';
import { IJwtAuthPayload, ILoginInput } from '@/types/authorization.types';

export class AuthController {
	constructor(private authService: AuthService) {}

	async login(request: FastifyRequest) {
		try {
			const { email, password } = request.body as ILoginInput;
			const token = await this.authService.login({
				email,
				password,
			});

			return token;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'USER_NOT_FOUND':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 404,
						});
					case 'USER_INACTIVE':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 403,
						});
					case 'INVALID_PASSWORD':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 401,
						});

					default:
						console.error('Unhandled AppError:', error);
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 500,
						});
				}
			}
		}
	}

	async logout(request: FastifyRequest, reply: FastifyReply) {
		reply.clearCookie('token');
		return new ApiResponse({
			message: 'Logout realizado com sucesso',
			success: true,
			statusCode: 200,
		});
	}
	async changePassword(request: FastifyRequest) {
		try {
			const { id } = request.user as IJwtAuthPayload;
			const { password, newPassword } = request.body as {
				password: string;
				newPassword: string;
			};
			if (password === newPassword) {
				throw new HttpError({
					message: 'A nova senha deve ser diferente da senha atual',
					errorCode: 'BAD_REQUEST',
					statusCode: 400,
				});
			}
			await this.authService.changePassword(id, password, newPassword);
			return;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'USER_NOT_FOUND':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 404,
						});
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 400,
						});
					case 'BAD_REQUEST':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 400,
						});
					default:
						throw new HttpError({
							message: 'Erro interno do servidor',
							errorCode: 'INTERNAL_SERVER_ERROR',
							statusCode: 500,
						});
				}
			}
		}
	}
}
