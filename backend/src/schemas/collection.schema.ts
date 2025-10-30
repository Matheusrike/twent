import { UploadedFile } from '@/types/uploadFile.types';
import { z } from 'zod';
import { UuidSchema } from './generic.schema';
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
    success: z.literal(true),
    message: z.string().meta({ examples: ['Coleções recuperadas com sucesso'] }),
    
})

export const CollectionPostResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Coleção criada com sucesso'] }),
	data: z
		.object({
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
				description: 'Gênero alvo da coleção',
				examples: ['MALE', 'FEMALE', 'UNISEX'],
			}),
			price_range_min: z
				.any()
				.nullable()
				.meta({
					description: 'Preço mínimo da coleção',
					examples: [17000000.01],
				}),
			price_range_max: z
				.any()
				.nullable()
				.meta({
					description: 'Preço máximo da coleção',
					examples: [20000000.01],
				}),
			banner_image: z.undefined(),
			is_active: z.boolean().meta({
				description: 'Status de atividade da coleção',
				examples: [true, false],
			}),
			created_at: z.date().meta({
				description: 'Data e hora de criação da coleção',
				examples: ['2024-01-15T10:20:30Z'],
			}),
			updated_at: z.date().meta({
				description: 'Data e hora da última atualização da coleção',
				examples: ['2024-01-20T14:25:35Z'],
			}),
			// Arrumar depois que o endpoint de produtos for feito
			products: z.array(z.any()).meta({
				description: 'Lista de produtos associados à coleção',
				examples: [],
			}),
		})
		.meta({ description: 'Dados da coleção criada' }),
});

export const CollectionBadRequestResponseSchema =  ApiResponseSchema.extend({
    success: z.literal(false),
    message: z.string().meta({ examples: ['Dados da coleção inválidos'] }),
    errorCode: z.string().meta({ examples: ['BAD_REQUEST'] }),
})

export const CollectionConflictResponseSchema =  ApiResponseSchema.extend({
    success: z.literal(false),
    message: z.string().meta({ examples: ['Conflito de dados ao criar a coleção'] }),
    errorCode: z.string().meta({ examples: ['CONFLICT'] }),
})