import type { FastifyRequest } from 'fastify';
import { CollectionService } from '@/services/Collection.service';
import { AppError, HttpError } from '@/utils/errors.util';
import { ICreateCollection } from '@/types/collection.types';

export class CollectionController {
	constructor(private collectionService: CollectionService) {}

	async create(request: FastifyRequest) {
		try {
			const collection = await this.collectionService.create(
				request.body as ICreateCollection,
			);

			return collection;
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

	async uploadBanner(request: FastifyRequest) {
		try {
			const { collectionId } = request.params as { collectionId: string };
			const bannerImage = await request.saveRequestFiles();
			const imagePath = bannerImage[0].filepath;

			const uploadedCollection =
				await this.collectionService.uploadBanner(
					collectionId,
					imagePath,
				);

			return uploadedCollection;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'CONFLICT':
						throw new HttpError({
							errorCode: error.errorCode,
							message: error.message,
							statusCode: 409,
						});

					case 'NOT_FOUND':
						throw new HttpError({
							errorCode: error.errorCode,
							message: 'Coleção nao encontrada',
							statusCode: 404,
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
