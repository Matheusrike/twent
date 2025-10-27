import type { PrismaClient, Prisma } from '@prisma/generated/client';
import { AppError } from '@/utils/errors.util';
import {
	deleteFromCloudinary,
	uploadToCloudinary,
} from '@/utils/cloudinary.util';
import { IPaginationParams } from '@/types/pagination.types';
import {
	CreateCollectionType,
	UpdateCollectionType,
} from '@/schemas/collection.schema';
import { ICollectionFilters, GenderTarget } from '@/types/collection.types';

export class CollectionService {
	constructor(private database: PrismaClient) {}

	async create(data: CreateCollectionType) {
		try {
			this.validatePriceRange(data.price_range_min, data.price_range_max);

			const collection = await this.database.collection.create({
				data: {
					name: data.name,
					description: data.description,
					launch_year: data.launch_year,
					target_gender: (data.target_gender ||
						'UNISEX') as GenderTarget,
					price_range_min: data.price_range_min,
					price_range_max: data.price_range_max,
					is_active: data.is_active ?? true,
				},
				include: {
					products: true,
				},
			});

			return collection;
		} catch (error: unknown) {
			const prismaError = error as { code?: string };
			if (prismaError.code === 'P2002') {
				throw new AppError({
					message: `Coleção com o nome "${data.name}" já existe!`,
					errorCode: 'CONFLICT',
				});
			}
			throw error;
		}
	}

	async uploadBanner(id: string, filePath: string) {
		try {
			const { publicId } = await uploadToCloudinary({
				filePath,
				folder: 'collections',
			});

			const currentImageBanner =
				await this.database.collection.findUnique({
					where: { id },
					select: { image_banner: true },
				});

			if (currentImageBanner?.image_banner) {
				await deleteFromCloudinary(currentImageBanner.image_banner);
			}

			const collection = await this.database.collection.update({
				where: { id },
				data: {
					image_banner: publicId,
				},
			});

			return collection;
		} catch (error: unknown) {
			const prismaError = error as { code?: string };
			if (prismaError.code === 'P2025') {
				throw new AppError({
					message: `Coleção com ID ${id} não encontrada!`,
					errorCode: 'NOT_FOUND',
				});
			}
			throw error;
		}
	}

	async findById(id: string) {
		const collection = await this.database.collection.findUnique({
			where: { id },
			include: {
				products: true,
			},
		});

		if (!collection) {
			throw new AppError({
				message: `Coleção com ID ${id} não encontrada!`,
				errorCode: 'NOT_FOUND',
			});
		}

		return collection;
	}

	async findAll(
		filters?: ICollectionFilters,
		pagination?: IPaginationParams,
	) {
		const page =
			pagination?.page && pagination.page > 0 ? pagination.page : 1;
		const limit =
			pagination?.limit && pagination.limit > 0 ? pagination.limit : 10;
		const skip = (page - 1) * limit;

		const where: Prisma.CollectionWhereInput = {};

		if (filters?.name) {
			where.name = {
				contains: filters.name,
			};
		}
		if (filters?.target_gender) {
			where.target_gender = filters.target_gender;
		}
		if (filters?.is_active !== undefined) {
			where.is_active = filters.is_active;
		}
		if (filters?.launch_year) {
			where.launch_year = filters.launch_year;
		}

		const [collections, total] = await Promise.all([
			this.database.collection.findMany({
				where,
				include: {
					products: {
						select: {
							id: true,
							name: true,
						},
					},
				},
				orderBy: {
					created_at: 'desc',
				},
				skip,
				take: limit,
			}),
			this.database.collection.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);
		const hasNext = page < totalPages;
		const hasPrev = page > 1;

		return {
			collections,
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

	async findActive(pagination?: IPaginationParams) {
		return this.findAll({ is_active: true }, pagination);
	}

	async update(id: string, data: UpdateCollectionType) {
		try {
			if (
				data.price_range_min !== undefined ||
				data.price_range_max !== undefined
			) {
				const current = await this.database.collection.findUnique({
					where: { id },
				});
				const newMin = data.price_range_min ?? current?.price_range_min;
				const newMax = data.price_range_max ?? current?.price_range_max;
				this.validatePriceRange(
					newMin ? Number(newMin) : undefined,
					newMax ? Number(newMax) : undefined,
				);
			}

			const updateData: Prisma.CollectionUpdateInput = {};

			if (data.name !== undefined) updateData.name = data.name;
			if (data.description !== undefined)
				updateData.description = data.description;
			if (data.launch_year !== undefined)
				updateData.launch_year = data.launch_year;
			if (data.target_gender !== undefined)
				updateData.target_gender = data.target_gender as GenderTarget;
			if (data.price_range_min !== undefined)
				updateData.price_range_min = data.price_range_min;
			if (data.price_range_max !== undefined)
				updateData.price_range_max = data.price_range_max;
			if (data.is_active !== undefined)
				updateData.is_active = data.is_active;

			const collection = await this.database.collection.update({
				where: { id },
				data: updateData,
				include: {
					products: true,
				},
			});

			return collection;
		} catch (error: unknown) {
			const prismaError = error as { code?: string };
			switch (prismaError.code) {
				case 'P2025':
					throw new AppError({
						message: `Coleção com ID "${id}" não encontrada!`,
						errorCode: 'NOT_FOUND',
					});

				case 'P2002':
					throw new AppError({
						message: `Coleção com o nome "${data.name}" já existe!`,
						errorCode: 'CONFLICT',
					});
			}
			throw error;
		}
	}

	async deactivate(id: string) {
		return this.update(id, { is_active: false });
	}

	async activate(id: string) {
		return this.update(id, { is_active: true });
	}

	async delete(id: string) {
		await this.findById(id);

		const collection = await this.database.collection.findUnique({
			where: { id },
			include: {
				_count: {
					select: { products: true },
				},
			},
		});

		if (collection && collection._count.products > 0) {
			throw new AppError({
				message: `Não é possível deletar a coleção "${collection.name}" pois ela possui ${collection._count.products} produto(s) associado(s)!`,
				errorCode: 'CONFLICT',
			});
		}

		await this.database.collection.delete({
			where: { id },
		});

		return { message: 'Coleção deletada com sucesso!' };
	}

	async getStats(id: string) {
		const collection = await this.database.collection.findUnique({
			where: { id },
			include: {
				products: {
					select: {
						price: true,
						is_active: true,
					},
				},
			},
		});

		if (!collection) {
			throw new AppError({
				message: `Coleção com ID "${id}" não encontrada!`,
				errorCode: 'NOT_FOUND',
			});
		}

		const activeProducts = collection.products.filter((p) => p.is_active);
		const totalProducts = collection.products.length;

		return {
			collection_name: collection.name,
			total_products: totalProducts,
			active_products: activeProducts.length,
			inactive_products: totalProducts - activeProducts.length,
			price_range: {
				min: collection.price_range_min,
				max: collection.price_range_max,
			},
			target_gender: collection.target_gender,
			is_active: collection.is_active,
		};
	}

	private validatePriceRange(min?: number, max?: number) {
		if (min !== undefined && max !== undefined) {
			const minNum =
				typeof min === 'number' ? min : parseFloat(String(min));
			const maxNum =
				typeof max === 'number' ? max : parseFloat(String(max));

			if (minNum > maxNum) {
				throw new AppError({
					message:
						'Preço mínimo não pode ser maior que o preço máximo',
					errorCode: 'BAD_REQUEST',
				});
			}
		}
	}
}
