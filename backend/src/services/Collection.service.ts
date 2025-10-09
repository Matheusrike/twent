import prisma from '@prisma/client';
import { Prisma } from '@prisma/generated/client';
import {
	ICollectionFilters,
	ICreateCollection,
	IUpdateCollection,
} from '@/types/collection.types';

class CollectionService {
	async create(data: ICreateCollection) {
		try {
			this.validatePriceRange(data.price_range_min, data.price_range_max);

			const collection = await prisma.collection.create({
				data: {
					name: data.name,
					description: data.description,
					launch_year: data.launch_year,
					target_gender: data.target_gender || 'UNISEX',
					price_range_min: data.price_range_min,
					price_range_max: data.price_range_max,
					image_banner: data.image_banner,
					is_active: data.is_active ?? true,
				},
				include: {
					products: true,
				},
			});

			return collection;
		} catch (error) {
			if (error.code === 'P2002') {
				throw new Error(`Coleção com o nome "${data.name}" já existe!`);
			}
			throw error;
		}
	}

	async findById(id: string) {
		const collection = await prisma.collection.findUnique({
			where: { id },
			include: {
				products: true,
			},
		});

		if (!collection) {
			throw new Error(`Coleção com ID "${id}" não encontrada!`);
		}

		return collection;
	}

	async findAll(filters?: ICollectionFilters) {
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

		const collections = await prisma.collection.findMany({
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
		});

		return collections;
	}

	async findActive() {
		return this.findAll({ is_active: true });
	}

	async update(id: string, data: IUpdateCollection) {
		try {
			await this.findById(id);

			if (
				data.price_range_min !== undefined ||
				data.price_range_max !== undefined
			) {
				const current = await prisma.collection.findUnique({
					where: { id },
				});
				const newMin = data.price_range_min ?? current?.price_range_min;
				const newMax = data.price_range_max ?? current?.price_range_max;
				this.validatePriceRange(Number(newMin), Number(newMax));
			}

			const collection = await prisma.collection.update({
				where: { id },
				data,
				include: {
					products: true,
				},
			});

			return collection;
		} catch (error) {
			if (error.code === 'P2002') {
				throw new Error(`Coleção com o nome "${data.name}" já existe!`);
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

		const collection = await prisma.collection.findUnique({
			where: { id },
			include: {
				_count: {
					select: { products: true },
				},
			},
		});

		if (collection && collection._count.products > 0) {
			throw new Error(
				`Não é possível deletar a coleção "${collection.name}" pois ela possui ${collection._count.products} produto(s) associado(s)!`,
			);
		}

		await prisma.collection.delete({
			where: { id },
		});

		return { message: 'Coleção deletada com sucesso!' };
	}

	async getStats(id: string) {
		const collection = await prisma.collection.findUnique({
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
			throw new Error(`Coleção com ID "${id}" não encontrada!`);
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
			const minNum = typeof min === 'number' ? min : parseFloat(min);
			const maxNum = typeof max === 'number' ? max : parseFloat(max);

			if (minNum > maxNum) {
				throw new Error(
					'Preço mínimo não pode ser maior que o preço máximo!',
				);
			}
		}
	}
}

export const collectionService = new CollectionService();
export default CollectionService;
