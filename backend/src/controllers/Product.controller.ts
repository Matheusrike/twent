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
}
