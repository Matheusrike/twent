import { z } from 'zod';
import { ApiResponseSchema } from './api-response.schema';

export const getImageUrlParams = z.object({
	publicId: z
		.string()
		.min(1, 'publicId é obrigatório')
		.meta({
			description: 'ID público da imagem no Cloudinary',
			examples: ['folder/b2f1a9c4d8e2f001_x7kq9m3'],
		}),
	width: z.coerce
		.number('width precisa ser um número positivo maior que 0')
		.positive('width precisa ser um número positivo maior que 0')
		.gt(0, 'width precisa ser um número positivo maior que 0')
		.optional()
		.meta({
			description: 'Largura desejada da imagem',
			examples: [800, 1024],
		}),
	height: z.coerce
		.number('height precisa ser um número positivo maior que 0')
		.positive('height precisa ser um número positivo maior que 0')
		.gt(0, 'height precisa ser um número positivo maior que 0')
		.optional()
		.meta({
			description: 'Altura desejada da imagem',
			examples: [600, 768],
		}),
	format: z
		.enum(
			['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'],
			'format deve ser um dos seguintes valores: jpg, jpeg, png, gif, webp, bmp, tiff',
		)
		.optional()
		.meta({
			description: 'Formato desejado da imagem',
			examples: ['webp', 'jpg'],
		}),
	crop: z
		.enum(
			['fill', 'crop', 'thumb', 'auto'],
			'crop deve ser um dos seguintes valores: fill, crop, thumb, auto',
		)
		.optional()
		.meta({
			description: 'Método de corte da imagem',
			examples: ['fill', 'crop'],
		}),
});

export type GetImageUrlParamsType = z.infer<typeof getImageUrlParams>;

export const generateImageUrlResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z
		.string()
		.meta({ examples: ['URL da imagem gerada com sucesso'] }),
	data: z.object({
		url: z.url().meta({
			description: 'URL da imagem gerada',
			examples: [
				'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
			],
		}),
	}),
});
