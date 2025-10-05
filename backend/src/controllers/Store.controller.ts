import { StoreService } from '../services/Store.service.ts';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpError } from '../utils/errors.util.ts';
import { ApiResponse } from '../utils/api-response.util.ts';
import { StoreSchema } from '../schemas/store.schema.ts';

export class StoreController {
	private service = new StoreService();

	get = async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const response = await this.service.get();

			return reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Informações das filiais encontradas',
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
	};

	create = async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const parsed = StoreSchema.safeParse(request.body);

			if (!parsed.success) {
				console.log(parsed.error);
				return new HttpError({
					message: parsed.error.issues[0].message,
					statusCode: 400,
				});
			}

			await this.service.create(parsed.data!);
			reply.status(201).send(
				new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Filial criada',
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
				default:
					return new HttpError({
						message: error.message,
						statusCode: 500,
					});
			}
		}
	};

	update = (Request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
		try {
            const id = Request.params['id'];
            const parsed = StoreSchema.partial().parse(Request.body);

            this.service.update(id, parsed);

            reply.status(200).send(
                new ApiResponse({
                    statusCode: 200,
                    success: true,
                    message: 'Filial atualizada',
                })
            )
		} catch (error) {
			switch (error.errorCode) {
				case 'NOT_FOUND':
					return new HttpError({
						message: error.message,
						statusCode: 404,
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
	};
}
