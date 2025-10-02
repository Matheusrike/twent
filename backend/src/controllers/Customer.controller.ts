import { FastifyRequest, FastifyReply } from 'fastify';
import { UserSchema } from '../schemas/user.schema.ts';
import { CustomerService } from '../services/Customer.service.ts';
import { HttpError } from '../utils/errors.util.ts';
import { ApiResponse } from '../utils/api-response.util.ts';
import { TypeGetUserProps } from '../types/users.types.ts';

const customerService = new CustomerService();

export class CustomerController {
	private service: CustomerService;
	constructor() {
		this.service = customerService;

		this.create = this.create.bind(this);
		this.get = this.get.bind(this);
		this.update = this.update.bind(this);
	}

	async create(request: FastifyRequest, reply: FastifyReply) {
		try {
			const parsed = UserSchema.safeParse(request.body);

			if (!parsed.success) {
				return new HttpError({
					message: 'Dados enviados incorretos',
					statusCode: 400,
				});
			}

			await this.service.create(parsed.data!);
			reply.status(201).send(
				new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Usuário criado',
				}),
			);
		} catch (error) {
			switch (error.errorCode) {
				case 'CONFLICT':
					return new HttpError({
						message: error.message,
						statusCode: 409,
					});
				case 'BAD_REQUEST':
					return new HttpError({
						message: error.message,
						statusCode: 400,
					});
				case 'BAD_GATEWAY':
					return new HttpError({
						message: error.message,
						statusCode: 502,
					});
				case 'GATEWAY_TIMEOUT':
					return new HttpError({
						message: error.message,
						statusCode: 504,
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
			Querystring: TypeGetUserProps;
		}>,
		reply: FastifyReply,
	) {
		try {
			const { skip, take, ...filters } = request.query;

			const response = await this.service.get(filters, skip, take);

			return reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Informações do usuário encontradas',
					data: response,
				}),
			);
		} catch (error) {
			switch (error?.errorCode) {
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
					console.error(error);
					return new HttpError({
						message: error?.message ?? 'Erro interno',
						statusCode: 500,
					});
			}
		}
	}

	async update(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		try {
			const id = request.params['id'];
			const parsed = UserSchema.partial().parse(request.body);

			await this.service.update(id, parsed);
			reply.status(200).send({ message: 'Usuário atualizado' });
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
				case 'CONFLICT':
					return new HttpError({
						message: error.message,
						statusCode: 409,
					});
				case 'BAD_GATEWAY':
					return new HttpError({
						message: error.message,
						statusCode: 502,
					});
				case 'GATEWAY_TIMEOUT':
					return new HttpError({
						message: error.message,
						statusCode: 504,
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
