import { generateUniqueSKU } from '@/helpers/product-codes.helper';
import { CreateProductType } from '@/schemas/product.schema';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { AppError } from '@/utils/errors.util';
import { Prisma, PrismaClient } from '@prisma/generated/client';

export class ProductService {
	constructor(private database: PrismaClient) {}

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
					updated_by: user.id,
				},
			});

			return product;
		} catch (error) {
			if (error.code === 'P2003') {
				throw new AppError({
					message: 'Collection not found',
					errorCode: 'COLLECTION_NOT_FOUND',
				});
			}
			throw error;
		}
	}

	async findAllPublic() {
		const products = await this.database.product.findMany({
			where: {
				is_active: true,
			},
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
			orderBy: {
				created_at: 'desc',
			},
		});

		return products;
	}

	async findBySkuPublic(sku: string) {
		const product = await this.database.product.findUnique({
			where: {
				sku,
				is_active: true,
			},
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

		return product;
	}

	async findAllInternal(user: IJwtAuthPayload) {
		const products = await this.database.product.findMany({
			where: {
				is_active: true,
			},
			include: {
				collection: true,
				images: {
					where: {
						is_primary: true,
					},
				},
				inventory: user.storeId
					? {
							where: {
								store_id: user.storeId,
							},
						}
					: true,
				_count: {
					select: {
						sale_items: true,
						favorites: true,
					},
				},
			},
			orderBy: {
				created_at: 'desc',
			},
		});

		return products;
	}
}
