import { NewSale, SalesFilters } from '@/schemas/sale.schema';
import { SaleService } from '@/services/Sale.service';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { AppError, HttpError } from '@/utils/errors.util';
import { FastifyRequest } from 'fastify';

export class SaleController {
	constructor(private saleService: SaleService) {}

	async newSale(request: FastifyRequest) {
		try {
			const { storeId, id } = request.user as IJwtAuthPayload;
			const data = request.body as NewSale;
			const response = await this.saleService.newSale(
				data,
				storeId!,
				id!,
			);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							errorCode: error.errorCode,
							message: error.message,
							statusCode: 404,
						});
					case 'BAD_REQUEST':
						throw new HttpError({
							errorCode: error.errorCode,
							message: error.message,
							statusCode: 400,
						});
					default:
						throw new HttpError({
							errorCode: error.errorCode,
							message: error.message,
							statusCode: 500,
						});
				}
			}
		}
	}

	async getAllSales(request: FastifyRequest) {
		try {
			const filters = request.query as SalesFilters;
			const response = await this.saleService.getSales(filters);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					errorCode: error.errorCode,
					message: error.message,
					statusCode: 500,
				});
			}
		}
	}
	async getSales(request: FastifyRequest) {
		try {
			const { storeId } = request.user as IJwtAuthPayload;
			const filters = request.query as SalesFilters;
			const response = await this.saleService.getSales(filters, storeId);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					errorCode: error.errorCode,
					message: error.message,
					statusCode: 500,
				});
			}
		}
	}

	async cancelSale(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };
			const response = await this.saleService.cancelSale(id);
			return response;
		} catch (error) {
			if (error instanceof AppError) {
				throw new HttpError({
					errorCode: error.errorCode,
					message: error.message,
					statusCode: 500,
				});
			}
		}
	}
}
