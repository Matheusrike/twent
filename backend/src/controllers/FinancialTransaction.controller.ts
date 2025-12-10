import { FastifyRequest } from 'fastify';
import { FinancialTransactionService } from '@/services/FinancialTransaction.service';
import {
	CreateFinancialTransactionType,
	UpdateFinancialTransactionType,
	IFinancialTransactionFilters,
} from '@/schemas/financial-transaction.schema';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { IPaginationParams } from '@/types/pagination.types';
import { AppError, HttpError } from '@/utils/errors.util';

interface QueryParams {
	page?: string;
	limit?: string;
	type?: string;
	category?: string;
	store_id?: string;
	supplier_id?: string;
	start_date?: string;
	end_date?: string;
	min_amount?: string;
	max_amount?: string;
}

export class FinancialTransactionController {
	constructor(
		private financialTransactionService: FinancialTransactionService,
	) {}

	async create(request: FastifyRequest) {
		try {
			const transactionData =
				request.body as CreateFinancialTransactionType;
			const user = request.user as IJwtAuthPayload;
			const newTransaction =
				await this.financialTransactionService.create(
					transactionData,
					user,
				);
			return newTransaction;
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
			const query = request.query as QueryParams;

			const pagination: IPaginationParams = {
				page: query.page ? parseInt(query.page) : 1,
				limit: query.limit ? parseInt(query.limit) : 10,
			};

			const filters: IFinancialTransactionFilters = {
				type: query.type,
				category: query.category,
				store_id: query.store_id,
				supplier_id: query.supplier_id,
				start_date: query.start_date
					? new Date(query.start_date)
					: undefined,
				end_date: query.end_date ? new Date(query.end_date) : undefined,
				min_amount: query.min_amount
					? parseFloat(query.min_amount)
					: undefined,
				max_amount: query.max_amount
					? parseFloat(query.max_amount)
					: undefined,
			};

			const result = await this.financialTransactionService.findAll(
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
			const user = request.user as IJwtAuthPayload;
			const transaction = await this.financialTransactionService.findById(
				id,
				user,
			);
			return transaction;
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
			const transactionData =
				request.body as UpdateFinancialTransactionType;
			const user = request.user as IJwtAuthPayload;
			const updatedTransaction =
				await this.financialTransactionService.update(
					id,
					transactionData,
					user,
				);
			return updatedTransaction;
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

	async delete(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const user = request.user as IJwtAuthPayload;
			await this.financialTransactionService.delete(id, user);
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

	async getCashFlowReport(request: FastifyRequest) {
		try {
			const user = request.user as IJwtAuthPayload;
			const query = request.query as QueryParams;

			const startDate = query.start_date
				? new Date(query.start_date)
				: undefined;
			const endDate = query.end_date
				? new Date(query.end_date)
				: undefined;
			const storeId = query.store_id;

			const cashFlow =
				await this.financialTransactionService.getCashFlowReport(
					user,
					startDate,
					endDate,
					storeId,
				);
			return cashFlow;
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

	async getFinancialSummary(request: FastifyRequest) {
		try {
			const user = request.user as IJwtAuthPayload;
			const query = request.query as QueryParams;

			const startDate = query.start_date
				? new Date(query.start_date)
				: undefined;
			const endDate = query.end_date
				? new Date(query.end_date)
				: undefined;
			const storeId = query.store_id;

			const summary =
				await this.financialTransactionService.getFinancialSummary(
					user,
					startDate,
					endDate,
					storeId,
				);
			return summary;
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

	async getTransactionsByCategory(request: FastifyRequest) {
		try {
			const user = request.user as IJwtAuthPayload;
			const query = request.query as QueryParams;

			const startDate = query.start_date
				? new Date(query.start_date)
				: undefined;
			const endDate = query.end_date
				? new Date(query.end_date)
				: undefined;
			const storeId = query.store_id;

			const byCategory =
				await this.financialTransactionService.getTransactionsByCategory(
					user,
					startDate,
					endDate,
					storeId,
				);
			return byCategory;
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
}
