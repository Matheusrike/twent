import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '@/services/Auth.service';
import { ApiResponse } from '@/utils/api-response.util';
import { AppError, HttpError } from '@/utils/errors.util';
import { ILoginInput } from '@/types/authorization.types';

export class AuthController {
	constructor(private authService: AuthService) {}

	async login(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { email, password } = request.body as ILoginInput;

			const emailLowerCase = email.toLowerCase();

			const token = await this.authService.login({
				email: emailLowerCase,
				password,
			});

			if (process.env.NODE_ENV === 'dev') {
				return new ApiResponse({
					message: 'Login realizado com sucesso',
					data: { token },
					success: true,
					statusCode: 200,
				}).send(reply);
			}

			reply.setCookie('token', token, {
				httpOnly: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7,
			});

			return new ApiResponse({
				message: 'Login realizado com sucesso',
				success: true,
				statusCode: 200,
			});
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
}
