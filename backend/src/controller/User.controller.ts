import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../service/user.service.ts';
import { HttpError } from '../utils/errors.util.ts';
import { TypeGetUserProps } from '../types/users.types.ts';
import { ApiResponse } from '../utils/api-response.util.ts';
import { UserType } from '../../prisma/generated/prisma/index.js';

const userService = new UserService();
export class UserController {
	private service: UserService;
	constructor() {
		this.service = userService;

		this.getInfo = this.getInfo.bind(this);
		this.get = this.get.bind(this);
		this.changeStatus = this.changeStatus.bind(this);
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
	async get(
		request: FastifyRequest<{
			Querystring: {
				params?: string | string[];
				cursor?: string;
				take?: number;
			};
		}>,
		reply: FastifyReply,
	) {
		try {
			const { params, cursor, take } = request.query;

			const paramsObj: TypeGetUserProps = {};

			if (params) {
				const paramArray = Array.isArray(params) ? params : [params];

				for (const paramStr of paramArray) {
					const match = paramStr.match(/\[(.+?)\]:(.+)/);
					if (!match) continue;

					const key = match[1].trim() as keyof TypeGetUserProps;
					const value = match[2].trim();

					if (key === 'take') {
						paramsObj.take = Number(value);
					} else if (key === 'user_type') {
						if (
							Object.values(UserType).includes(value as UserType)
						) {
							paramsObj.user_type = value as UserType;
						} else {
							throw new Error(
								`Valor inválido para user_type: ${value}`,
							);
						}
					} else {
						paramsObj[key] = value;
					}
				}
			}

			const response = await this.service.get(paramsObj, cursor, take);

			reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message:
						Object.keys(response).length > 2
							? 'Usuários encontrados'
							: 'Usuário encontrado',
					data: response,
				}),
			);
		} catch (error) {
			switch (error.errorCode) {
				case 'BAD_REQUEST':
					return new HttpError({
						message: error.message,
						statusCode: 400,
					});
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
			const { id } = request.params;
			const { newStatus } = request.body;
			const response = await this.service.changeStatus(id, newStatus);
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
