import { FastifyRequest } from 'fastify';
import { ProductService } from '@/services/Product.service';
import { CreateProductType } from '@/schemas/product.schema';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { AppError, HttpError } from '@/utils/errors.util';

export class ProductController {
	constructor(private productService: ProductService) {}

	async create(request: FastifyRequest) {
		try {
			const productData = request.body as CreateProductType;
			const user = request.user as IJwtAuthPayload;
			console.log('Usuário que está criando o produto:', user);
			const newProduct = await this.productService.create(
				productData,
				user,
			);
			return newProduct;
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

	async findAllPublic() {
		try {
			const products = await this.productService.findAllPublic();
			return products;
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

	async findBySkuPublic(request: FastifyRequest) {
		try {
			const { sku } = request.params as { sku: string };
			const product = await this.productService.findBySkuPublic(sku);
			return product;
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

	async findAllInternal(request: FastifyRequest) {
		try {
			const user = request.user as IJwtAuthPayload;
			const products = await this.productService.findAllInternal(user);
			return products;
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

	async getOneInternal(request: FastifyRequest) {
		try {
			const { sku } = request.params as { sku: string };
			const user = request.user as IJwtAuthPayload;
			const product = await this.productService.getOneInternal(sku, user);
			return product;
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
			const { sku } = request.params as { sku: string };
			const productData = request.body as UpdateProductType;
			const user = request.user as IJwtAuthPayload;
			const updatedProduct = await this.productService.update(
				sku,
				productData,
				user,
			);
			return updatedProduct;
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
			const { sku } = request.params as { sku: string };
			const user = request.user as IJwtAuthPayload;
			await this.productService.delete(sku, user);
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
