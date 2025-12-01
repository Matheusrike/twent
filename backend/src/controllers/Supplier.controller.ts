import { FastifyRequest } from 'fastify';
import { SupplierService } from '@/services/Supplier.service';
import {
	CreateSupplierType,
	UpdateSupplierType,
	SupplierFilters,
} from '@/schemas/supplier.schema';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { AppError, HttpError } from '@/utils/errors.util';

export class SupplierController {
	constructor(private supplierService: SupplierService) {}

	async create(request: FastifyRequest) {
		try {
			const supplierData = request.body as CreateSupplierType;
			const user = request.user as IJwtAuthPayload;
			const newSupplier = await this.supplierService.create(
				supplierData,
				user.id,
			);
			return newSupplier;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'CONFLICT':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 409,
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
	}

	async findAll(request: FastifyRequest) {
		try {
			const { page, limit, ...query } = request.query as {
				page: number;
				limit: number;
			} & SupplierFilters;

			const result = await this.supplierService.findAll(
				query,
				page,
				limit,
			);
			return result;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 404,
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
	}

	async findById(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const supplier = await this.supplierService.findById(id);
			return supplier;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					message: error.message,
					statusCode: 404,
					errorCode: error.errorCode,
				});
			}

			throw new HttpError({
				statusCode: 500,
				message: 'Internal server error',
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async update(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const supplierData = request.body as UpdateSupplierType;
			const user = request.user as IJwtAuthPayload;
			const updatedSupplier = await this.supplierService.update(
				id,
				supplierData,
				user,
			);
			return updatedSupplier;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'CONFLICT':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 409,
						});
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 404,
						});
					case 'BAD_REQUEST':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 400,
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
	}

	async setActiveStatus(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const user = request.user as IJwtAuthPayload;
			const supplier = await this.supplierService.setActiveStatus(
				id,
				user,
			);
			return supplier;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 404,
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
	}

	async delete(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const user = request.user as IJwtAuthPayload;
			await this.supplierService.delete(id, user);
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 404,
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
	}

	async getTransactions(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const transactions = await this.supplierService.getTransactions(id);
			return transactions;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 404,
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
	}
}
