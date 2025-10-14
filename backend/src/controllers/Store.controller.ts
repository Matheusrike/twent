import { StoreService } from '@/services/Store.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpError } from '@/utils/errors.util';
import { ApiResponse } from '@/utils/api-response.util';
import { StoreSchema } from '@/schemas/store.schema';
import { TypeGetStoreProps } from '@/types/store.types';

export class StoreController {
	constructor(private storeService: StoreService) {}

	async get(request: FastifyRequest, reply: FastifyReply) {
		try {
            const { skip, take, ...filters } = request.query as TypeGetStoreProps;
			const response = await this.storeService.get(filters, Number(skip), Number(take));

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
	}

	async create(request: FastifyRequest, reply: FastifyReply) {
		try {
			const parsed = StoreSchema.safeParse(request.body);

			if (!parsed.success) {
				return new HttpError({
					message: parsed.error.issues[0].message,
					statusCode: 400,
				});
			}

			await this.storeService.create(parsed.data!);

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
	}

	async update(
		Request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		try {
			const { id } = Request.params;
			const parsed = StoreSchema.partial().parse(Request.body);

			const response = await this.storeService.update(id, parsed);

			reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Filial atualizada',
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
			const response = await this.storeService.changeStatus(
				id,
				newStatus,
			);
			reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Status da filial atualizado',
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
