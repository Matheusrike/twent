import type { FastifyRequest, FastifyReply } from 'fastify';
import { CollectionService } from '@/services/Collection.service';
import { ApiResponse } from '@/utils/api-response.util';
import { AppError, HttpError } from '@/utils/errors.util';
import { ICreateCollection } from '@/types/collection.types';

export class CollectionController {
	constructor(private collectionService: CollectionService) {}

	async create(request: FastifyRequest, reply: FastifyReply) {
		try {
			const collection = await this.collectionService.create(
				request.body as ICreateCollection,
			);

			return new ApiResponse({
				statusCode: 201,
				success: true,
				message: 'Coleção criada com sucesso',
				data: collection,
			}).send(reply);
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'CONFLICT':
						throw new HttpError({
							errorCode: error.errorCode,
							message: error.message,
							statusCode: 409,
						});
					default:
						console.error('Unhandled AppError:', error);
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 500,
						});
				}
			}
		}
	}
}
