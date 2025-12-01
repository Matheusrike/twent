import { generateUniqueSKU } from '@/helpers/product-codes.helper';
import { CreateProductType, UpdateProductType } from '@/schemas/product.schema';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { AppError } from '@/utils/errors.util';
import { Prisma, PrismaClient } from '@prisma/generated/client';
import { ImageService } from '@/services/Image.service';
import { IPaginationParams } from '@/types/pagination.types';

export class ProductService {
	private imageService: ImageService;

	constructor(private database: PrismaClient) {
		this.imageService = new ImageService();
	}

	async create(data: CreateProductType, user: IJwtAuthPayload) {
		try {

			const sku = await generateUniqueSKU();

			const product = await this.database.product.create({
				data: {
					sku,
					name: data.name,
					description: data.description,
					price: new Prisma.Decimal(data.price),
					currency: data.currency,
					cost_price: data.cost_price
						? new Prisma.Decimal(data.cost_price)
						: undefined,
					collection_id: data.collection_id,
					limited_edition: data.limited_edition ?? false,
					production_limit: data.production_limit,
					specifications: data.specifications ?? {},
					created_by: user.id,
				},
				include: {
					collection: true,
					images: true,
				},
			});

			return product;
		} catch (error) {
			if (error.code === 'P2003') {
				throw new AppError({
					message: error.message,
					errorCode: 'NOT_FOUND',
				});
			}
			throw error;
		}
	}

	async findAllPublic(pagination?: IPaginationParams) {
		const page =
			pagination?.page && pagination.page > 0 ? pagination.page : 1;
		const limit =
			pagination?.limit && pagination.limit > 0 ? pagination.limit : 10;
		const skip = (page - 1) * limit;

		const where: Prisma.ProductWhereInput = {
			is_active: true,
		};

		const [products, total] = await Promise.all([
			this.database.product.findMany({
				where,
				select: {
					sku: true,
					name: true,
					description: true,
					price: true,
					currency: true,
					limited_edition: true,
					production_limit: true,
					specifications: true,
					collection: {
						select: {
							id: true,
							name: true,
							description: true,
							target_gender: true,
							launch_year: true,
						},
					},
					images: {
						select: {
							id: true,
							public_id: true,
							is_primary: true,
						},
					},
				},
				orderBy: { created_at: 'desc' },
				skip,
				take: Number(limit),
			}),
			this.database.product.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);
		const hasNext = page < totalPages;
		const hasPrev = page > 1;

		const productsWithUrls = products.map((product) => ({
			...product,
			images: product.images.map((img) => ({
				...img,
				url: this.imageService.generateUrl(img.public_id, {}),
			})),
		}));

		return {
			products: productsWithUrls,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				hasNext,
				hasPrev,
			},
		};
	}

	async findBySkuPublic(sku: string) {
		const product = await this.database.product.findUnique({
			where: { sku, is_active: true },
			select: {
				sku: true,
				name: true,
				description: true,
				price: true,
				currency: true,
				limited_edition: true,
				production_limit: true,
				specifications: true,
				collection: {
					select: {
						id: true,
						name: true,
						description: true,
						target_gender: true,
						launch_year: true,
						price_range_min: true,
						price_range_max: true,
					},
				},
				images: {
					select: {
						id: true,
						public_id: true,
						is_primary: true,
					},
				},
			},
		});

		if (!product) {
			throw new AppError({
				message: 'Product not found',
				errorCode: 'PRODUCT_NOT_FOUND',
			});
		}

		const productWithUrls = {
			...product,
			images: product.images.map((img) => ({
				...img,
				url: this.imageService.generateUrl(img.public_id, {}),
			})),
		};

		return productWithUrls;
	}

	async findAllInternal(
		user: IJwtAuthPayload,
		pagination?: IPaginationParams,
	) {
		const page =
			pagination?.page && pagination.page > 0 ? pagination.page : 1;
		const limit =
			pagination?.limit && pagination.limit > 0 ? pagination.limit : 10;
		const skip = (page - 1) * limit;

		const where: Prisma.ProductWhereInput = { is_active: true };

		const [products, total] = await Promise.all([
			this.database.product.findMany({
				where,
				include: {
					collection: true,
					images: { where: { is_primary: true } },
					inventory: user.storeId
						? { where: { store_id: user.storeId } }
						: true,
					_count: {
						select: {
							sale_items: true,
							favorites: true,
						},
					},
				},
				orderBy: { created_at: 'desc' },
				skip,
				take: Number(limit),
			}),
			this.database.product.count({ where }),
		]);

		const productsWithUrls = products.map((product) => ({
			...product,
			images: product.images.map((img) => ({
				...img,
				url: this.imageService.generateUrl(img.public_id, {}),
			})),
		}));

		const totalPages = Math.ceil(total / limit);
		const hasNext = page < totalPages;
		const hasPrev = page > 1;

		return {
			products: productsWithUrls,
			pagination: {
				page,
				limit,
				total,
				totalPages,
				hasNext,
				hasPrev,
			},
		};
	}

	async findBySkuInternal(sku: string, user: IJwtAuthPayload) {
		const product = await this.database.product.findUnique({
			where: { sku },
			include: {
				collection: true,
				images: true,
				price_history: {
					include: {
						changedBy: {
							select: {
								id: true,
								first_name: true,
								last_name: true,
								email: true,
							},
						},
					},
					orderBy: { changed_at: 'desc' },
					take: 10,
				},
				inventory: user.storeId
					? {
							where: { store_id: user.storeId },
							include: {
								store: {
									select: {
										id: true,
										name: true,
										code: true,
									},
								},
							},
						}
					: {
							include: {
								store: {
									select: {
										id: true,
										name: true,
										code: true,
									},
								},
							},
						},
				updatedBy: {
					select: {
						id: true,
						first_name: true,
						last_name: true,
						email: true,
					},
				},
				_count: {
					select: {
						sale_items: true,
						favorites: true,
						inventory_movements: true,
					},
				},
			},
		});

		if (!product) {
			throw new AppError({
				message: 'Product not found',
				errorCode: 'PRODUCT_NOT_FOUND',
			});
		}

		const productWithUrls = {
			...product,
			images: product.images.map((img) => ({
				...img,
				url: this.imageService.generateUrl(img.public_id, {}),
			})),
		};

		return productWithUrls;
	}

	async update(sku: string, data: UpdateProductType, user: IJwtAuthPayload) {
		try {
			const existingProduct = await this.database.product.findUnique({
				where: { sku },
			});

			if (!existingProduct) {
				throw new AppError({
					message: 'Product not found',
					errorCode: 'PRODUCT_NOT_FOUND',
				});
			}

			const shouldLogPriceChange =
				data.price && data.price !== existingProduct.price.toNumber();

			const updatedProduct = await this.database.product.update({
				where: { sku },
				data: {
					name: data.name,
					description: data.description,
					price: data.price
						? new Prisma.Decimal(data.price)
						: undefined,
					currency: data.currency,
					cost_price: data.cost_price
						? new Prisma.Decimal(data.cost_price)
						: undefined,
					collection_id: data.collection_id,
					limited_edition: data.limited_edition,
					production_limit: data.production_limit,
					specifications: data.specifications,
					is_active: data.is_active,
					updated_by: user.id,
				},
				include: { collection: true, images: true },
			});

			if (shouldLogPriceChange) {
				await this.database.productPriceHistory.create({
					data: {
						product_id: sku,
						old_price: existingProduct.price,
						new_price: new Prisma.Decimal(data.price!),
						changed_by: user.id,
						reason: data.price_change_reason,
					},
				});
			}

			return updatedProduct;
		} catch (error) {
			if (error instanceof AppError) throw error;
			if (error.code === 'P2003') {
				throw new AppError({
					message: 'Collection not found',
					errorCode: 'COLLECTION_NOT_FOUND',
				});
			}
			throw error;
		}
	}

	async delete(sku: string, user: IJwtAuthPayload) {
		const product = await this.database.product.findUnique({
			where: { sku },
		});

		if (!product) {
			throw new AppError({
				message: 'Product not found',
				errorCode: 'PRODUCT_NOT_FOUND',
			});
		}

		await this.database.product.update({
			where: { sku },
			data: { is_active: false, updated_by: user.id },
		});
	}

	async uploadImages(sku: string, filesPaths: string[]) {
		const MAX_IMAGES_PER_PRODUCT = 5;

		try {
			const existingImages = await this.database.productImage.count({
				where: { product_id: sku },
			});

			if (filesPaths.length + existingImages > MAX_IMAGES_PER_PRODUCT) {
				throw new AppError({
					message: 'Limite de 5 imagens por produto excedido',
					errorCode: 'PRODUCT_IMAGE_LIMIT_EXCEEDED',
				});
			}

			const publicIds = await this.imageService
				.uploadFiles(filesPaths, 'products')
				.then((res) => res as { publicId: string }[]);

			await this.database.productImage.createMany({
				data: publicIds.map((img, index) => ({
					product_id: sku,
					public_id: img.publicId,
					is_primary: existingImages === 0 && index === 0,
				})),
			});

			const images = await this.database.productImage.findMany({
				where: { product_id: sku },
				orderBy: { created_at: 'asc' },
				select: {
					public_id: true,
					is_primary: true,
				},
			});

			return images;
		} catch (error) {
			if (error.code === 'P2003') {
				throw new AppError({
					message: 'Product not found',
					errorCode: 'PRODUCT_NOT_FOUND',
				});
			}

			throw error;
		}
	}

	async deleteImages(sku: string, publicIds: string[]) {
		const images = await this.database.productImage.findMany({
			where: {
				public_id: { in: publicIds },
				product_id: sku,
			},
		});

		if (images.length === 0) {
			throw new AppError({
				message: 'Nenhuma imagem encontrada',
				errorCode: 'IMAGES_NOT_FOUND',
			});
		}

		if (images.length !== publicIds.length) {
			throw new AppError({
				message: 'Algumas imagens não foram encontradas',
				errorCode: 'SOME_IMAGES_NOT_FOUND',
			});
		}

		await Promise.all(
			images.map((image) => this.imageService.delete(image.public_id)),
		);

		await this.database.productImage.deleteMany({
			where: { public_id: { in: publicIds } },
		});

		const hasPrimaryDeleted = images.some((img) => img.is_primary);

		if (hasPrimaryDeleted) {
			const firstImage = await this.database.productImage.findFirst({
				where: { product_id: sku },
			});

			if (firstImage) {
				await this.database.productImage.update({
					where: { id: firstImage.id },
					data: { is_primary: true },
				});
			}
		}
	}

	async setPrimaryImage(sku: string, publicId: string) {
		const image = await this.database.productImage.findFirst({
			where: { public_id: publicId, product_id: sku },
		});

		if (!image) {
			throw new AppError({
				message: 'Image not found',
				errorCode: 'IMAGE_NOT_FOUND',
			});
		}

		await this.database.productImage.updateMany({
			where: { product_id: sku },
			data: { is_primary: false },
		});

		await this.database.productImage.update({
			where: { public_id: publicId },
			data: { is_primary: true },
		});
	}

	async getPriceHistory(sku: string) {
		const product = await this.database.product.findUnique({
			where: { sku },
		});

		if (!product) {
			throw new AppError({
				message: 'Product not found',
				errorCode: 'PRODUCT_NOT_FOUND',
			});
		}

		const history = await this.database.productPriceHistory.findMany({
			where: { product_id: sku },
			include: {
				changedBy: {
					select: {
						id: true,
						first_name: true,
						last_name: true,
						email: true,
					},
				},
			},
			orderBy: { changed_at: 'desc' },
		});

		return history;
	}
}
