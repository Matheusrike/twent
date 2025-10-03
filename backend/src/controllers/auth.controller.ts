import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '@/services/Auth.service';
import { ApiResponse } from '@/utils/api-response.util';
import { AppError, HttpError } from '@/utils/errors.util';

export class AuthController {
	constructor(private authService: AuthService) {}

	async login(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { email, password } = request.body as {
				email: string;
				password: string;
			};
			const result = await this.authService.login({
				email,
				password,
			});
			return new ApiResponse({
				message: 'Login successful',
				data: result,
				success: true,
				statusCode: 200,
			}).send(reply);
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
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 500,
						});
				}
			}

			console.error(error);
			return ApiResponse.genericError(reply);
		}
	}
}
