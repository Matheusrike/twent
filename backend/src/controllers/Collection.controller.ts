import type { FastifyRequest } from 'fastify';
import { CollectionService } from '@/services/Collection.service';
import { AppError, HttpError } from '@/utils/errors.util';
import { GenderTarget, ICollectionFilters } from '@/types/collection.types';
import { IPaginationParams } from '@/types/pagination.types';
import {
	CollectionParamsType,
	CollectionQueryType,
	CreateCollectionType,
	UpdateCollectionType,
} from '@/schemas/collection.schema';

export class CollectionController {
	constructor(private collectionService: CollectionService) {}

	async create(request: FastifyRequest) {
		try {
			const collection = await this.collectionService.create(
				request.body as CreateCollectionType,
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
			throw error;
		}
	}

	async uploadBanner(request: FastifyRequest) {
		try {
			const { id } = request.params as CollectionParamsType;
			const bannerImage = await request.saveRequestFiles();
			const imagePath = bannerImage[0].filepath;

			const uploadedCollection =
				await this.collectionService.uploadBanner(id, imagePath);

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
							message: 'Coleção não encontrada',
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
			throw error;
		}
	}

	async findById(request: FastifyRequest) {
		try {
			const { id } = request.params as CollectionParamsType;
			const collection = await this.collectionService.findById(id);
			return collection;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							errorCode: error.errorCode,
							message: 'Coleção não encontrada',
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
			throw error;
		}
	}

	async findAll(request: FastifyRequest) {
		try {
			const query = request.query as CollectionQueryType;

			const filters: ICollectionFilters = {
				name: query.name,
				target_gender: query.target_gender as GenderTarget,
				is_active: query.is_active,
				launch_year: query.launch_year,
			};

			const pagination: IPaginationParams = {
				page: query.page,
				limit: query.limit,
			};

			const collections = await this.collectionService.findAll(
				filters,
				pagination,
			);
			return collections;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					default:
						console.error('Unhandled AppError:', error);
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 500,
						});
				}
			}
			throw error;
		}
	}

	async update(request: FastifyRequest) {
		try {
			const { id } = request.params as CollectionParamsType;
			const data = request.body as UpdateCollectionType;

			const collection = await this.collectionService.update(id, data);
			return collection;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							errorCode: error.errorCode,
							message: 'Coleção não encontrada',
							statusCode: 404,
						});
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
			throw error;
		}
	}

	async deactivate(request: FastifyRequest) {
		try {
			const { id } = request.params as CollectionParamsType;
			const collection = await this.collectionService.deactivate(id);
			return collection;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							errorCode: error.errorCode,
							message: 'Coleção não encontrada',
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
			throw error;
		}
	}

	async activate(request: FastifyRequest) {
		try {
			const { id } = request.params as CollectionParamsType;
			const collection = await this.collectionService.activate(id);
			return collection;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							errorCode: error.errorCode,
							message: 'Coleção não encontrada',
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
			throw error;
		}
	}

	async delete(request: FastifyRequest) {
		try {
			const { id } = request.params as CollectionParamsType;
			const result = await this.collectionService.delete(id);
			return result;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							errorCode: error.errorCode,
							message: 'Coleção não encontrada',
							statusCode: 404,
						});
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
			throw error;
		}
	}

	async getStats(request: FastifyRequest) {
		try {
			const { id } = request.params as CollectionParamsType;
			const stats = await this.collectionService.getStats(id);
			return stats;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							errorCode: error.errorCode,
							message: 'Coleção não encontrada',
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
			throw error;
		}
	}
}
