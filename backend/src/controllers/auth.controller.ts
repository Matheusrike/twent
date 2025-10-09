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
			const token = await this.authService.login({
				email,
				password,
			});

			const res = {
				message: 'Login realizado com sucesso',
				data: { token },
				success: true,
				statusCode: 200,
			};

			console.log('Login response:', res);

			return new ApiResponse(res).send(reply);
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
}
