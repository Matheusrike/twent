import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../services/User.service.ts';
import { HttpError } from '../utils/errors.util.ts';
import { ApiResponse } from '../utils/api-response.util.ts';

export class UserController {
	constructor(private userService: UserService) {}

	async getInfo(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { id } = request.user as { id: string };

			const response = await this.userService.getInfo(id);
			reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Informações do usuário encontradas',
					data: response,
				}),
			);
		} catch (error) {
			switch (error.errorCode) {
				case 'NOT_FOUND':
					return new HttpError({
						message: error.message,
						statusCode: 404,
					});
				default:
					return new HttpError({
						message: error.message,
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
            const {role_name} = request.user as { role_name: string };
			const { id } = request.params;
			const { newStatus } = request.body;
			const response = await this.userService.changeStatus(id, newStatus, role_name);
			reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message:
						newStatus == true
							? 'Usuário:' + id + ' alterado para ativo'
							: 'Usuário:' + id + ' alterado para inativo',
					data: response,
				}),
			);
		} catch (error) {
			switch (error.errorCode) {
				case 'NOT_FOUND':
					return new HttpError({
						message: error.message,
						statusCode: 404,
					});
				case 'UNAUTHORIZED':
					return new HttpError({
						message: error.message,
						statusCode: 401,
					});
				case 'BAD_REQUEST':
					return new HttpError({
						message: error.message,
						statusCode: 400,
					});
				default:
					return new HttpError({
						message: error.message,
						statusCode: 500,
					});
			}
		}
	}
}
