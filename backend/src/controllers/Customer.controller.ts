import { FastifyRequest } from 'fastify';
import { CreateCustomer, CustomerQuerystring } from '@/schemas/customer.schema';
import { CustomerService } from '@/services/Customer.service';
import { AppError, HttpError } from '@/utils/errors.util';

export class CustomerController {
	constructor(private customerService: CustomerService) {}

	async createCustomer(request: FastifyRequest) {
		try {
			const data = request.body as CreateCustomer;

			const response = await this.customerService.createCustomer(data);

			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error?.errorCode) {
					case 'CONFLICT':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 409,
						});
					case 'BAD_REQUEST':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 400,
						});
					case 'BAD_GATEWAY':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 502,
						});
					case 'GATEWAY_TIMEOUT':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 504,
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
	async getCustomers(request: FastifyRequest) {
		try {
			const { skip, take, ...filters } = request.query as {
				skip: number;
				take: number;
			} & CustomerQuerystring;

			const response = await this.customerService.getCustomers(
				filters,
				skip,
				take,
			);

			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error?.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 404,
						});
					default:
						console.error(error);
						throw new HttpError({
							message: error?.message ?? 'Erro interno',
							errorCode: 'INTERNAL_SERVER_ERROR',
							statusCode: 500,
						});
				}
			}
		}
	}

	async updateCustomer(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };

			const data = request.body as CreateCustomer;

			const response = await this.customerService.updateCustomer(
				id,
				data,
			);

			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 404,
						});
					case 'UNAUTHORIZED':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 401,
						});
					case 'BAD_REQUEST':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 400,
						});
					case 'CONFLICT':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 409,
						});
					case 'BAD_GATEWAY':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 502,
						});
					case 'GATEWAY_TIMEOUT':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 504,
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
