import { FastifyRequest, FastifyReply } from 'fastify';
import { UserSchema } from '../schema/user.schema.ts';
import { CustomerService } from '../service/customer.service.ts';
import { HttpError } from '../utils/errors.util.ts';
import { ApiResponse } from '../utils/api-response.util.ts';

const customerService = new CustomerService();

export class CustomerController {
	private service: CustomerService;
	constructor() {
		this.service = customerService;

		this.create = this.create.bind(this);
		this.getAll = this.getAll.bind(this);
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

	async getAll(
		request: FastifyRequest<{ Querystring: { [key: string]: string } }>,
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
							response.length > 1
								? 'Usuários encontrados'
								: 'Usuário encontrado',
						data: response,
					}),
				);
			}
			const response = await this.service.getAll();
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
