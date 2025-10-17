import { FastifyRequest, FastifyReply } from 'fastify';
import { UserSchema } from '@/schemas/user.schema';
import { CustomerService } from '@/services/Customer.service';
import { HttpError } from '@/utils/errors.util';
import { ApiResponse } from '@/utils/api-response.util';
import { TypeGetUserProps } from '@/types/users.types';

export class CustomerController {
	constructor(private customerService: CustomerService) {}

	async create(request: FastifyRequest, reply: FastifyReply) {
		try {
			const parsed = UserSchema.safeParse(request.body);

			if (!parsed.success) {
				throw new HttpError({
					message: 'Dados enviados incorretos',
                    errorCode: 'BAD_REQUEST',
					statusCode: 400,
				});
			}

			await this.customerService.create(parsed.data!);
			reply.status(201).send(
				new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Usuário cadastrado',
				}),
			);
		} catch (error) {
			switch (error?.errorCode) {
				case 'CONFLICT':
					throw new HttpError({
						message: error.message,
						errorCode: error.errorCode,
						statusCode: 409,
					});
				case 'BAD_REQUEST':
					throw new HttpError({
						message: error.message,
						errorCode: error.errorCode,
						statusCode: 400,
					});
				case 'BAD_GATEWAY':
					throw new HttpError({
						message: error.message,
						errorCode: error.errorCode,
						statusCode: 502,
					});
				case 'GATEWAY_TIMEOUT':
					throw new HttpError({
						message: error.message,
						errorCode: error.errorCode,
						statusCode: 504,
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
	async get(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { skip, take, ...filters } =
				request.query as TypeGetUserProps;

			const response = await this.customerService.get(
				filters,
				skip,
				take,
			);

			reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Informação(ões) do(s) usuário(s) encontrada(s)',
					data: response,
				}),
			);
		} catch (error) {
			switch (error?.errorCode) {
				case 'NOT_FOUND':
					throw new HttpError({
						message: error.message,
						errorCode: error.errorCode,
						statusCode: 404,
					});
				default:
					console.error(error);
					throw new HttpError({
						message: error?.message ?? 'Erro interno',
						errorCode: 'INTERNAL_SERVER_ERROR',
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

			await this.customerService.update(id, parsed);
			reply
				.status(200)
				.send({ message: 'Informação(ões) do usuário atualizada(s)' });
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
