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
}
