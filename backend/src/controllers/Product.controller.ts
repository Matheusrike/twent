import { FastifyRequest } from 'fastify';
import { ProductService } from '@/services/Product.service';
import { CreateProductType, UpdateProductType } from '@/schemas/product.schema';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { AppError, HttpError } from '@/utils/errors.util';
import { SkuType } from '@/schemas/generic.schema';

export class ProductController {
	constructor(private productService: ProductService) {}

	async create(request: FastifyRequest) {
		try {
			const productData = request.body as CreateProductType;
			const user = request.user as IJwtAuthPayload;
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
			console.error(error);
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

	async findBySkuInternal(request: FastifyRequest) {
		try {
			const { sku } = request.params as { sku: string };
			const user = request.user as IJwtAuthPayload;
			const product = await this.productService.findBySkuInternal(
				sku,
				user,
			);
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

	async uploadImages(request: FastifyRequest) {
		try {
			const { sku } = request.params as SkuType;
			const files = await request.saveRequestFiles();
			const filepaths = files.map((file) => file.filepath);

			const images = await this.productService.uploadImages(
				sku,
				filepaths,
			);

			return images;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'PRODUCT_NOT_FOUND':
						throw new HttpError({
							message: error.message,
							statusCode: 404,
							errorCode: error.errorCode,
						});
					case 'PRODUCT_IMAGE_LIMIT_EXCEEDED':
						throw new HttpError({
							message: error.message,
							statusCode: 400,
							errorCode: error.errorCode,
						});
				}
			}

			console.error(error);

			throw new HttpError({
				statusCode: 500,
				message: 'Internal server error',
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async deleteImage(request: FastifyRequest) {
		try {
			const { sku, publicId } = request.params as {
				sku: string;
				publicId: string;
			};
			await this.productService.deleteImage(sku, publicId);
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

	async setPrimaryImage(request: FastifyRequest) {
		try {
			const { sku, publicId } = request.params as {
				sku: string;
				publicId: string;
			};
			await this.productService.setPrimaryImage(sku, publicId);
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

	async getPriceHistory(request: FastifyRequest) {
		try {
			const { sku } = request.params as { sku: string };
			const history = await this.productService.getPriceHistory(sku);
			return history;
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
