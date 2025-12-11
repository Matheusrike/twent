import { FastifyRequest } from 'fastify';
import { UserService } from '@/services/User.service';
import { AppError, HttpError } from '@/utils/errors.util';
import { IJwtAuthPayload } from '@/types/authorization.types';

export class UserController {
	constructor(private userService: UserService) {}

	async getInfo(request: FastifyRequest) {
		try {
			const id =
				(request.params as { id: string }).id ||
				(request.user as IJwtAuthPayload).id;

			const response = await this.userService.getInfo(id);

			return response;
		} catch (error) {
			console.error(error);
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'USER_NOT_FOUND':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 404,
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

	async activateUser(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const response = await this.userService.activateUser(id);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					message: error.message,
					errorCode: error.errorCode,
					statusCode: 500,
				});
			}
		}
	}
	async deactivateUser(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const response = await this.userService.deactivateUser(id);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					message: error.message,
					errorCode: error.errorCode,
					statusCode: 500,
				});
			}
		}
	}

	async deleteUser(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const response = await this.userService.deleteUser(id);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				const statusCode = error.errorCode === 'USER_NOT_FOUND' ? 404 : 500;
				throw new HttpError({
					message: error.message,
					errorCode: error.errorCode,
					statusCode,
				});
			}
			throw new HttpError({
				message: 'Erro interno do servidor',
				errorCode: 'INTERNAL_SERVER_ERROR',
				statusCode: 500,
			});
		}
	}
}
