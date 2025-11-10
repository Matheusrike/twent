import { FastifyRequest } from 'fastify';
import { ProductService } from '@/services/Product.service';
import { CreateProductType, UpdateProductType } from '@/schemas/product.schema';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { AppError, HttpError } from '@/utils/errors.util';
import { SkuType } from '@/schemas/generic.schema';
import path from 'node:path';

export class ProductController {
	private readonly IMAGE_FORMATS_ALLOWED = [
		'jpg',
		'jpeg',
		'png',
		'gif',
		'webp',
		'bmp',
		'tiff',
	];

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
			const files = await request.saveRequestFiles({
				limits: { fileSize: 5 * 1024 * 1024 },
			});

			const filepaths = files.map((file) => {
				const ext = path
					.extname(file.filename)
					.replace('.', '')
					.toLowerCase();

				if (!this.IMAGE_FORMATS_ALLOWED.includes(ext)) {
					throw new AppError({
						message: `Formato de arquivo não permitido: ${ext}`,
						errorCode: 'FILE_FORMAT_NOT_ALLOWED',
					});
				}

				return file.filepath;
			});

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
					case 'FILE_FORMAT_NOT_ALLOWED':
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

	async deleteImages(request: FastifyRequest) {
		try {
			const { sku } = request.params as { sku: string };
			const { publicIds } = request.body as { publicIds: string[] };

			if (
				!publicIds ||
				!Array.isArray(publicIds) ||
				publicIds.length === 0
			) {
				throw new HttpError({
					message: 'É necessário enviar pelo menos um publicId',
					statusCode: 400,
					errorCode: 'NO_PUBLIC_IDS_PROVIDED',
				});
			}

			await this.productService.deleteImages(sku, publicIds);
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
			const { sku } = request.params as { sku: string };
			const { publicId } = request.body as { publicId: string };

			if (!publicId) {
				throw new HttpError({
					message: 'É necessário enviar o publicId da imagem',
					statusCode: 400,
					errorCode: 'NO_PUBLIC_ID_PROVIDED',
				});
			}

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
