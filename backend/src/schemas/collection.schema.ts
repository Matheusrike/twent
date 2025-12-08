import { UploadedFile } from '@/types/uploadFile.type';
import { z } from 'zod';
import {
	ConflictResponseSchema,
	NotFoundResponseSchema,
	PaginationSchema,
	UuidSchema,
} from './generic.schema';
import { ApiResponseSchema } from './api-response.schema';

export const GenderTargetEnum = z.enum(['MALE', 'FEMALE', 'UNISEX']);

export const CollectionParamsSchema = UuidSchema.extend({
	id: z.uuid('ID da coleção deve ser um UUID válido').meta({
		description: 'ID da coleção',
		examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
	}),
});

export type CollectionParamsType = z.infer<typeof CollectionParamsSchema>;

export const CollectionQuerySchema = z.object({
	page: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : undefined))
		.refine((val) => val === undefined || val > 0, {
			message: 'Página deve ser maior que 0',
		})
		.meta({
			description: 'Número da página',
			examples: ['1', '2', '3'],
		}),

	limit: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : undefined))
		.refine((val) => val === undefined || (val > 0 && val <= 100), {
			message: 'Limite deve ser entre 1 e 100',
		})
		.meta({
			description: 'Itens por página',
			examples: ['10', '20', '50'],
		}),

	name: z
		.string()
		.optional()
		.meta({
			description: 'Filtrar por nome da coleção',
			examples: ['Verão', 'Inverno'],
		}),

	target_gender: GenderTargetEnum.optional().meta({
		description: 'Filtrar por gênero alvo',
		examples: ['MALE', 'FEMALE', 'UNISEX'],
	}),

	is_active: z
		.preprocess(
			(val) =>
				val === 'true' ? true : val === 'false' ? false : undefined,
			z.boolean().optional(),
		)
		.meta({
			description: 'Filtrar por status ativo/inativo',
			examples: ['true', 'false'],
		}),

	launch_year: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : undefined))
		.refine((val) => val === undefined || (val >= 1900 && val <= 2100), {
			message: 'Ano de lançamento inválido',
		})
		.meta({
			description: 'Filtrar por ano de lançamento',
			examples: ['2023', '2024'],
		}),
});

export type CollectionQueryType = z.infer<typeof CollectionQuerySchema>;

export const CreateCollectionSchema = z
	.object({
		name: z.string().meta({
			description: 'Nome da coleção',
			examples: ["L'Heure", 'Momentum'],
		}),
		description: z
			.string()
			.optional()
			.meta({
				description: 'Descrição da coleção',
				examples: ['Coleção de moda feminina'],
			}),
		launch_year: z
			.number()
			.optional()
			.meta({
				description: 'Ano de lançamento da coleção',
				examples: [2023],
			}),
		target_gender: z
			.enum(['MALE', 'FEMALE', 'UNISEX'])
			.optional()
			.default('UNISEX')
			.meta({
				description: 'Sexo alvo da coleção',
				examples: ['MALE', 'FEMALE', 'UNISEX'],
			}),
		price_range_min: z
			.number()
			.optional()
			.meta({
				description: 'Preço mínimo da coleção',
				examples: [17000000.01],
			}),
		price_range_max: z
			.number()
			.optional()
			.meta({
				description: 'Preço máximo da coleção',
				examples: [20000000.01],
			}),
		is_active: z
			.boolean()
			.optional()
			.meta({
				description: 'Status de atividade da coleção',
				examples: [true, false],
			}),
	})
	.refine(
		(data) => {
			if (data.price_range_min && data.price_range_max) {
				return data.price_range_min <= data.price_range_max;
			}
			return true;
		},
		{
			message: 'Preço mínimo não pode ser maior que o preço máximo',
			path: ['price_range_min'],
		},
	);

export type CreateCollectionType = z.infer<typeof CreateCollectionSchema>;

export const UpdateCollectionSchema = z
	.object({
		name: z
			.string()
			.optional()
			.meta({
				description: 'Nome da coleção',
				examples: ["L'Heure", 'Momentum'],
			}),

		description: z
			.string()
			.optional()
			.nullable()
			.meta({
				description: 'Descrição da coleção',
				examples: ['Coleção de moda feminina'],
			}),

		launch_year: z
			.number()
			.optional()
			.nullable()
			.meta({
				description: 'Ano de lançamento da coleção',
				examples: [2023, 2024],
			}),

		target_gender: GenderTargetEnum.optional().meta({
			description: 'Gênero alvo da coleção',
			examples: ['MALE', 'FEMALE', 'UNISEX'],
		}),

		price_range_min: z
			.number()
			.optional()
			.nullable()
			.meta({
				description: 'Preço mínimo dos produtos',
				examples: [17000000.01],
			}),

		price_range_max: z
			.number()
			.optional()
			.nullable()
			.meta({
				description: 'Preço máximo dos produtos',
				examples: [20000000.01],
			}),

		is_active: z
			.boolean()
			.optional()
			.meta({
				description: 'Status ativo/inativo da coleção',
				examples: [true, false],
			}),
	})
	.refine(
		(data) => {
			if (data.price_range_min && data.price_range_max) {
				return data.price_range_min <= data.price_range_max;
			}
			return true;
		},
		{
			message: 'Preço mínimo não pode ser maior que o preço máximo',
			path: ['price_range_min'],
		},
	);

export type UpdateCollectionType = z.infer<typeof UpdateCollectionSchema>;

export const UploadCollectionImageBodySchema = z.object({
	bannerImage: z
		.custom<UploadedFile>(
			(val): val is UploadedFile =>
				!!val &&
				typeof val === 'object' &&
				'mimetype' in val &&
				(val as UploadedFile).mimetype.startsWith('image/'),
			{
				message:
					'O arquivo enviado deve ser uma imagem com no máximo 5MB e em formato JPEG, JPG, PNG ou WEBP',
			},
		)
		.refine((val) => !!val, {
			message: 'O campo bannerImage é obrigatório.',
		})
		.meta({
			description: 'Imagem de capa da coleção',
			examples: [
				'banner.jpeg',
				'banner.jpg',
				'banner.png',
				'banner.webp',
			],
		}),
});

export type UploadCollectionImageBodyType = z.infer<
	typeof UploadCollectionImageBodySchema
>;

export const CollectionGetResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true).meta({
		examples: [true],
	}),
	message: z.string().meta({
		examples: ['Coleções encontradas com sucesso'],
	}),
	data: z.object({
		collections: z
			.array(
				z.object({
					id: z.uuid().meta({
						description: 'ID da coleção',
						examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
					}),
					name: z.string().meta({
						description: 'Nome da coleção',
						examples: ["L'Heure", 'Momentum'],
					}),
					description: z
						.string()
						.nullable()
						.meta({
							description: 'Descrição da coleção',
							examples: ['Coleção de moda feminina'],
						}),
					launch_year: z.number().meta({
						description: 'Ano de lançamento da coleção',
						examples: [2023],
					}),
					target_gender: GenderTargetEnum.meta({
						description: 'Gênero alvo da coleção',
						examples: ['MALE', 'FEMALE', 'UNISEX'],
					}),
					price_range_min: z.any(),
					price_range_max: z.any(),
					image_public_id: z.string().nullable(),
					is_active: z.boolean(),
					created_at: z.coerce.date(),
					updated_at: z.coerce.date(),
					products: z.array(
						z.object({
							sku: z.string(),
							name: z.string(),
						}),
					),
				}),
			)
			.meta({
				description: 'Lista de coleções',
				examples: [
					{
						id: 'd8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c',
						name: "L'Heure",
						description: 'Coleção de moda feminina',
						launch_year: 2023,
						target_gender: GenderTargetEnum,
					},
				],
			}),
		pagination: PaginationSchema,
	}),
});

export const CollectionGetByIdResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	data: z.object({
		id: z.uuid(),
		name: z.string(),
		description: z.string(),
		launch_year: z.number(),
		target_gender: GenderTargetEnum,
		price_range_min: z.any(),
		price_range_max: z.any(),
		image_public_id: z.string().nullable(),
		is_active: z.boolean(),
		created_at: z.coerce.date(),
		updated_at: z.coerce.date(),
		products: z.array(
			z.object({
				sku: z.string(),
				collection_id: z.uuid(),
				name: z.string(),
				description: z.string(),
				limited_edition: z.boolean(),
				production_limit: z.null(),
				price: z.any(),
				currency: z.string(),
				cost_price: z.any(),
				specifications: z.object({
					glass: z.string(),
					total_weight: z.number(),
					case_diameter: z.number(),
					case_material: z.string(),
					movement_type: z.string(),
				}),
				is_active: z.boolean(),
				created_by: z.uuid(),
				updated_by: z.uuid(),
				created_at: z.coerce.date(),
				updated_at: z.coerce.date(),
			}),
		),
	}),
});

export const CollectionPostResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true).meta({
		examples: [true],
	}),
	message: z.string().meta({
		examples: ['Coleção criada com sucesso'],
	}),
	data: z.object({
		id: z.uuid().meta({
			description: 'ID da coleção',
			examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
		}),
		name: z.string().meta({
			description: 'Nome da coleção',
			examples: ["L'Heure", 'Momentum'],
		}),
		description: z
			.string()
			.nullable()
			.meta({
				description: 'Descrição da coleção',
				examples: ['Coleção de moda feminina'],
			}),
		launch_year: z
			.number()
			.nullable()
			.meta({
				description: 'Ano de lançamento da coleção',
				examples: [2023],
			}),
		target_gender: GenderTargetEnum.meta({
			description: 'Sexo alvo da coleção',
			examples: ['MALE', 'FEMALE', 'UNISEX'],
		}),
		price_range_min: z
			.any()
			.optional()
			.meta({
				description: 'Preço mínimo da coleção',
				examples: [17000000.01],
			}),
		price_range_max: z
			.any()
			.optional()
			.meta({
				description: 'Preço máximo da coleção',
				examples: [20000000.01],
			}),
		is_active: z.boolean().meta({
			description: 'Status ativo/inativo da coleção',
			examples: [true, false],
		}),
		created_at: z.date().meta({
			description: 'Data de criação da coleção',
			examples: ['2024-01-01T00:00:00.000Z'],
		}),
		updated_at: z.date().meta({
			description: 'Data de atualização da coleção',
			examples: ['2024-01-01T00:00:00.000Z'],
		}),
	}),
});

export const UploadCollectionImageResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true).meta({
		examples: [true],
	}),
	message: z.string().meta({
		examples: ['Imagem da coleção atualizada com sucesso'],
	}),
	data: z.object({
		id: z.uuid().meta({
			description: 'ID da coleção',
			examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
		}),
		name: z.string().meta({
			description: 'Nome da coleção',
			examples: ["L'Heure", 'Momentum'],
		}),
		description: z
			.string()
			.nullable()
			.meta({
				description: 'Descrição da coleção',
				examples: ['Coleção de moda feminina'],
			}),
		image_public_id: z.string().meta({
			description: 'ID público da imagem da coleção',
			examples: ['collections/abcd1234efgh5678'],
		}),
	}),
});

export const CollectionPutResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true).meta({
		examples: [true],
	}),
	message: z.string().meta({
		examples: ['Coleção atualizada com sucesso'],
	}),
	data: z.object({
		id: z.uuid().meta({
			description: 'ID da coleção',
			examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
		}),
		name: z.string().meta({
			description: 'Nome da coleção',
			examples: ["L'Heure", 'Momentum'],
		}),
		description: z
			.string()
			.nullable()
			.meta({
				description: 'Descrição da coleção',
				examples: ['Coleção de moda feminina'],
			}),
		launch_year: z.number().meta({
			description: 'Ano de lançamento da coleção',
			examples: [2023],
		}),
		target_gender: GenderTargetEnum.meta({
			description: 'Gênero alvo da coleção',
			examples: ['MALE', 'FEMALE', 'UNISEX'],
		}),
		price_range_min: z.any(),
		price_range_max: z.any(),
		image_public_id: z.string().nullable(),
		is_active: z.boolean(),
		created_at: z.coerce.date(),
		updated_at: z.coerce.date(),
	}),
});

export const CollectionConflictResponseSchema = ConflictResponseSchema.extend({
	message: z.string('Já existe uma coleção com este nome').meta({
		examples: ['Já existe uma coleção com este nome'],
	}),
});

export const CollectionNotFoundResponseSchema = NotFoundResponseSchema.extend({
	message: z.string('Coleção não encontrada').meta({
		examples: ['Coleção não encontrada'],
	}),
});
