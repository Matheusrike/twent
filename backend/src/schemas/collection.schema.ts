import { UploadedFile } from '@/types/uploadFile.type';
import { z } from 'zod';

export const CreateCollectionSchema = z.object({
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
	image_banner: z.string().optional(),
	is_active: z
		.boolean()
		.optional()
		.meta({
			description: 'Status de atividade da coleção',
			examples: [true, false],
		}),
});

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
