import { FastifyRequest } from 'fastify';
import { SupplierService } from '@/services/Supplier.service';
import {
	CreateSupplierType,
	UpdateSupplierType,
	ISupplierFilters,
} from '@/schemas/supplier.schema';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { IPaginationParams } from '@/types/pagination.types';
import { AppError, HttpError } from '@/utils/errors.util';

export class SupplierController {
	constructor(private supplierService: SupplierService) {}

	async create(request: FastifyRequest) {
		try {
			const supplierData = request.body as CreateSupplierType;
			const user = request.user as IJwtAuthPayload;
			const newSupplier = await this.supplierService.create(
				supplierData,
				user,
			);
			return newSupplier;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					message: error.message,
					statusCode: 400,
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

	async findAll(request: FastifyRequest) {
		try {
			const user = request.user as IJwtAuthPayload;
			const query = request.query as IPaginationParams & ISupplierFilters;

			const pagination: IPaginationParams = {
				page: query.page ? parseInt(String(query.page), 10) : 1,
				limit: query.limit ? parseInt(String(query.limit), 10) : 10,
			};

			const filters: ISupplierFilters = {
				name: query.name,
				email: query.email,
				contact_name: query.contact_name,
				city: query.city,
				state: query.state,
				country: query.country,
				is_active:
					query.is_active !== undefined
						? typeof query.is_active === 'string'
							? query.is_active === 'true'
							: !!query.is_active
						: undefined,
			};

			const result = await this.supplierService.findAll(
				user,
				filters,
				pagination,
			);
			return result;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					message: error.message,
					statusCode: 400,
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
				throw new HttpError({
					message: error.message,
					statusCode: 400,
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

	async delete(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const user = request.user as IJwtAuthPayload;
			await this.supplierService.delete(id, user);
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

	async getTransactions(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const transactions = await this.supplierService.getTransactions(id);
			return transactions;
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
}
