import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../service/user.service.ts';
import { HttpError } from '../utils/errors.util.ts';
import { IGetUserProps } from '../types/users.types.ts';
import { ApiResponse } from '../utils/api-response.util.ts';

const userService = new UserService();
export class UserController {
	private service: UserService;
	constructor() {
		this.service = userService;
	}

	async getInfo(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		try {
			const { id } = request.params;
			const response = await this.service.getInfo(id);
			reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Informações do usuário encontradas',
					data: response,
				}),
			);
		} catch (error) {
			if (error.errorCode == 'NOT_FOUND') {
				return new HttpError({
					message: error.message,
					statusCode: 404,
				});
			}
			return new HttpError({
				message: error.message,
				statusCode: 500,
			});
		}
	}

	async get(
		request: FastifyRequest<{ Querystring: IGetUserProps }>,
		reply: FastifyReply,
	) {
		try {
			const query = request.query;
			if (Object.keys(query).length > 0) {
				const response = await this.service.get(query);
				console.log(response.length);
				reply.status(200).send(
					new ApiResponse({
						statusCode: 200,
						success: true,
						message:
							response.length > 0
								? 'Usuários encontrados'
								: 'Nenhum usuário encontrado',
						data: response,
					}),
				);
			}
			const response = await this.service.get({});
			reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Listando todos o usuários',
					data: response,
				}),
			);
		} catch (error) {
			return new HttpError({
				message: error.message,
				statusCode: 500,
			});
		}
	}

	async changeStatus(
		request: FastifyRequest<{
			Params: { id: string };
			Body: { is_active: boolean };
		}>,
		reply: FastifyReply,
	) {
		try {
			const { id } = request.params;
			const { is_active } = request.body;
			const response = await this.service.changeStatus(id, is_active);
			reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message:
						is_active == true
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
				default:
					return new HttpError({
						message: error.message,
						statusCode: 500,
					});
			}
		}
	}
}
