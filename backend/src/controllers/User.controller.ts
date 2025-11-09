import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '@/services/User.service';
import { AppError, HttpError } from '@/utils/errors.util';
import { ApiResponse } from '@/utils/api-response.util';

export class UserController {
	constructor(private userService: UserService) {}

	async getInfo(
		request: FastifyRequest<{ Querystring: { id: string } }>,
		reply: FastifyReply,
	) {
		try {
			const id = request.query.id || (request.user as { id: string }).id;

			const response = await this.userService.getInfo(id);
			new ApiResponse({
				statusCode: 200,
				success: true,
				message: 'Informações do usuário encontradas',
				data: response,
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
			new ApiResponse({
				statusCode: 200,
				success: true,
				message: 'Usuário ativado com sucesso',
				data: response,
			})
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
			new ApiResponse({
				statusCode: 200,
				success: true,
				message: 'Usuário ativado com sucesso',
				data: response,
			})
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
	async changeStatus(
		request: FastifyRequest<{
			Params: { id: string };
			Body: { newStatus: boolean };
		}>,
		reply: FastifyReply,
	) {
		try {
			const { id } = request.params;
			const { newStatus } = request.body;
			const response = await this.userService.changeStatus(id, newStatus);

			new ApiResponse({
				statusCode: 200,
				success: true,
				message:
					newStatus == true
						? 'Usuário:' + id + ' alterado para ativo'
						: 'Usuário:' + id + ' alterado para inativo',
				data: response,
			}).send(reply);
		} catch (error) {
			switch (error.errorCode) {
				case 'NOT_FOUND':
					throw new HttpError({
						message: error.message,
						errorCode: error.errorCode,
						statusCode: 404,
					});
				case 'UNAUTHORIZED':
					throw new HttpError({
						message: error.message,
						errorCode: error.errorCode,
						statusCode: 401,
					});
				case 'CONFLICT':
					throw new HttpError({
						message: error.message,
						errorCode: error.errorCode,
						statusCode: 409,
					});
				default:
					throw new HttpError({
						message: error.message,
						errorCode: error.errorCode,
						statusCode: 500,
					});
			}
		}
	}
}
