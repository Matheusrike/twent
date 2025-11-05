import { z } from 'zod';
import { SkuSchema } from './generic.schema';

export const ProductSkuSchema = SkuSchema.extend({
	sku: z.uuid('ID do produto deve ser um UUID válido').meta({
		description: 'ID do produto',
		examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
	}),
});

const specificationsSchema = z
	.object({
		case_material: z
			.string()
			.max(60, 'Material da caixa muito extenso')
			.optional()
			.meta({
				description: 'Material da caixa do produto',
				examples: ['Aço inoxidável', 'Titânio'],
			}),

		case_diameter: z
			.number()
			.positive('O diâmetro deve ser positivo')
			.optional()
			.meta({
				description: 'Diâmetro da caixa do produto em milímetros',
				examples: [40, 42.5],
			}),

		water_resistance: z
			.string()
			.max(60)
			.optional()
			.meta({
				description: 'Resistência à água do produto',
				examples: ['50 metros', '100 metros'],
			}),

		movement_type: z
			.string()
			.max(100)
			.optional()
			.meta({
				description: 'Tipo de movimento do relógio',
				examples: ['Automático', 'Quartzo'],
			}),

		total_weight: z
			.number()
			.positive('O peso total deve ser positivo')
			.optional()
			.meta({
				description: 'Peso total do produto em gramas',
				examples: [150, 200],
			}),

		glass: z
			.string()
			.max(60)
			.optional()
			.meta({
				description: 'Tipo de vidro do produto',
				examples: ['Safira', 'Mineral'],
			}),
	})
	.optional();

export const createProductSchema = z.object({
	name: z
		.string('O nome do produto é obrigatório')
		.min(2, 'O nome deve ter no mínimo 2 caracteres')
		.max(255, 'O nome deve ter no máximo 255 caracteres')
		.meta({
			description: 'Nome do produto',
			examples: ['Relógio de ouro', 'Relógio de prata'],
		}),

	description: z
		.string()
		.max(2000, 'A descrição pode ter no máximo 2000 caracteres')
		.optional()
		.meta({
			description: 'Descrição do produto',
			examples: [
				'Um relógio de luxo feito com materiais nobres.',
				'Relógio resistente à água e com design moderno.',
			],
		}),

	price: z
		.number('O preço é obrigatório')
		.positive('O preço deve ser positivo')
		.meta({
			description: 'Preço do produto',
			examples: [1999.99, 2500],
		}),

	currency: z
		.string()
		.length(3, 'A moeda deve seguir o padrão ISO 4217 (ex: USD, BRL)')
		.default('USD')
		.meta({
			description: 'Moeda do preço do produto',
			examples: ['USD', 'BRL'],
		}),

	cost_price: z
		.number()
		.positive('O custo deve ser positivo')
		.optional()
		.meta({
			description: 'Custo do produto',
			examples: [1500.5, 2000],
		}),

	collection_id: z.uuid('O ID da coleção deve ser um UUID válido').meta({
		description: 'ID da coleção à qual o produto pertence',
		examples: ['a3bb88f5-1c4d-4e2b-9f3a-123456789abc'],
	}),

	limited_edition: z
		.boolean()
		.optional()
		.default(false)
		.meta({
			description: 'Indica se o produto é de edição limitada',
			examples: [true, false],
		}),

	production_limit: z
		.number()
		.int('O limite de produção deve ser um número inteiro')
		.positive('O limite deve ser positivo')
		.optional()
		.meta({
			description: 'Limite de produção para edição limitada',
			examples: [100, 500],
		}),

	specifications: z
		.object({
			case_material: z
				.string()
				.max(60, 'Material da caixa muito extenso')
				.optional()
				.meta({
					description: 'Material da caixa do produto',
					examples: ['Aço inoxidável', 'Titânio'],
				}),

			case_diameter: z
				.number()
				.positive('O diâmetro deve ser positivo')
				.optional()
				.meta({
					description: 'Diâmetro da caixa do produto em milímetros',
					examples: [40, 42.5],
				}),

			water_resistance: z
				.string()
				.max(60)
				.optional()
				.meta({
					description: 'Resistência à água do produto',
					examples: ['50 metros', '100 metros'],
				}),

			movement_type: z
				.string()
				.max(100)
				.optional()
				.meta({
					description: 'Tipo de movimento do relógio',
					examples: ['Automático', 'Quartzo'],
				}),

			total_weight: z
				.number()
				.positive('O peso total deve ser positivo')
				.optional()
				.meta({
					description: 'Peso total do produto em gramas',
					examples: [150, 200],
				}),

			glass: z
				.string()
				.max(60)
				.optional()
				.meta({
					description: 'Tipo de vidro do produto',
					examples: ['Safira', 'Mineral'],
				}),
		})
		.optional()
		.meta({
			description:
				'Especificações adicionais do produto em formato chave-valor',
		}),
});

export const updateProductSchema = z.object({
	name: z
		.string()
		.min(2, 'O nome deve ter no mínimo 2 caracteres')
		.max(255, 'O nome deve ter no máximo 255 caracteres')
		.optional(),

	description: z
		.string()
		.max(2000, 'A descrição pode ter no máximo 2000 caracteres')
		.optional(),

	price: z.number().positive('O preço deve ser positivo').optional(),

	currency: z
		.string()
		.length(3, 'A moeda deve seguir o padrão ISO 4217')
		.optional(),

	cost_price: z.number().positive('O custo deve ser positivo').optional(),

	collection_id: z.uuid('O ID da coleção deve ser um UUID válido').optional(),

	limited_edition: z.boolean().optional(),

	production_limit: z
		.number()
		.int('O limite de produção deve ser um número inteiro')
		.positive('O limite deve ser positivo')
		.optional(),

	specifications: specificationsSchema,

	is_active: z.boolean().optional(),

	price_change_reason: z
		.string()
		.max(500, 'A razão deve ter no máximo 500 caracteres')
		.optional(),
});

export type ProductSkuType = z.infer<typeof ProductSkuSchema>;
export type CreateProductType = z.infer<typeof createProductSchema>;
export type UpdateProductType = z.infer<typeof updateProductSchema>;
