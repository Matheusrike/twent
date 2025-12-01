import { StoreService } from '@/services/Store.service';
import { FastifyRequest } from 'fastify';
import { AppError, HttpError } from '@/utils/errors.util';
import { CreateStore, StoreQuerystring } from '@/schemas/store.schema';

export class StoreController {
	constructor(private storeService: StoreService) {}

	async get(request: FastifyRequest) {
		try {
            const { id } = request.params as { id: string };
			const { skip, take, ...filters } = request.query as {
				skip: number;
				take: number;
			} & StoreQuerystring;

			const response = await this.storeService.get(
				filters,
				Number(skip),
				Number(take),
                id
			);

			return response;
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

	async create(request: FastifyRequest) {
		try {
			const data = request.body as CreateStore;

			const response = await this.storeService.create(data);

			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'CONFLICT':
						throw new HttpError({
							message: error.message,
							statusCode: 409,
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
			throw error;
		}
	}

	async update(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const data = request.body as Partial<CreateStore>;

			const response = await this.storeService.update(id, data);

			return response;
		} catch (error) {
			if (error instanceof AppError) {
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

	async activateStore(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const response = await this.storeService.activateStore(id);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
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
	async deactivateStore(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const response = await this.storeService.deactivateStore(id);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
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
}
