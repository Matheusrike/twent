import { StoreService } from '@/services/Store.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpError } from '@/utils/errors.util';
import { ApiResponse } from '@/utils/api-response.util';
import { StoreBodySchema } from '@/schemas/store.schema';
import { TypeGetStoreProps } from '@/types/store.types';

export class StoreController {
	constructor(private storeService: StoreService) {}

	async get(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { skip, take, ...filters } =
				request.query as TypeGetStoreProps;

			const response = await this.storeService.get(
				filters,
				Number(skip),
				Number(take),
			); 
            
			new ApiResponse({
				statusCode: 200,
				success: true,
				message: 'Informações das filiais encontradas',
				data: response,
			}).send(reply);
		} catch (error) {
			throw new HttpError({
				message: error.message,
				statusCode: 500,
			});
		}
	}

	async create(request: FastifyRequest, reply: FastifyReply) {
		try {
			const parsed = StoreBodySchema.safeParse(request.body);

			if (!parsed.success) {
				throw new HttpError({
					message: parsed.error.issues[0].message,
					statusCode: 400,
                    errorCode: 'BAD_REQUEST'
				});
			}

			await this.storeService.create(parsed.data!);

			new ApiResponse({
				statusCode: 201,
				success: true,
				message: 'Filial criada',
			}).send(reply);
		} catch (error) {
			switch (error.errorCode) {
				case 'CONFLICT':
					throw new HttpError({
						message: error.message,
						statusCode: 409,
                        errorCode: error.errorCode
					});
				case 'BAD_REQUEST':
					throw new HttpError({
						message: error.message,
						statusCode: 400,
                        errorCode: error.errorCode
					});
				default:
					throw new HttpError({
						message: error.message,
						statusCode: 500,
						errorCode: error.errorCode,
					});
			}
		}
	}

	async update(
		request: FastifyRequest<{ Params: { id: string } }>,
		reply: FastifyReply,
	) {
		try {
			const { id } = request.params;
			const parsed = StoreBodySchema.partial().safeParse(request.body);
            
            if (!parsed.success) {
                throw new HttpError({
                    message: parsed.error.issues[0].message,
                    statusCode: 400,
                    errorCode: 'BAD_REQUEST'
                });
            }

			const response = await this.storeService.update(id, parsed.data!);

			new ApiResponse({
				statusCode: 200,
				success: true,
				message: 'Filial atualizada',
				data: response,
			}).send(reply);
		} catch (error) {
			switch (error.errorCode) {
				case 'NOT_FOUND':
					throw new HttpError({
						message: error.message,
						statusCode: 404,
						errorCode: error.errorCode,
					});
				case 'CONFLICT':
					throw new HttpError({
						message: error.message,
						statusCode: 409,
						errorCode: error.errorCode,
					});
				case 'BAD_REQUEST':
					throw new HttpError({
						message: error.message,
						statusCode: 400,
						errorCode: error.errorCode,
					});
				default:
					throw new HttpError({
						message: error.message,
						statusCode: 500,
						errorCode: error.errorCode,
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

			new ApiResponse({
				statusCode: 200,
				success: true,
				message: 'Status da filial atualizado',
				data: response,
			}).send(reply);
		} catch (error) {
			switch (error.errorCode) {
				case 'NOT_FOUND':
					throw new HttpError({
						message: error.message,
						statusCode: 404,
						errorCode: error.errorCode,
					});
				case 'BAD_REQUEST':
					throw new HttpError({
						message: error.message,
						statusCode: 400,
						errorCode: error.errorCode,
					});
				default:
					throw new HttpError({
						message: error.message,
						statusCode: 500,
						errorCode: error.errorCode,
					});
			}
		}
	}
}
