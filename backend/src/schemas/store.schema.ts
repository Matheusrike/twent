import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';
import { StoreType } from '@prisma/generated/enums';
import { ApiResponseSchema } from './api-response.schema';

const storeType = StoreType;

const openingDays = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
];

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const StoreQuerystringSchema = z.object({
	id: z
		.string()
		.optional()
		.meta({ examples: ['61ba0e5e-59e5-403b-bb76-e317011f7399'] }),
	name: z
		.string()
		.optional()
		.meta({ examples: ['Example Twent'] }),
	type: z
		.enum(storeType)
		.optional()
		.meta({ examples: ['BRANCH'] }),
	email: z
		.string()
		.optional()
		.meta({ examples: ['example@twent.com.br'] }),
	phone: z
		.string()
		.optional()
		.meta({ examples: ['+55 11 9999-8888'] }),
	street: z
		.string()
		.optional()
		.meta({ examples: ['St. Example'] }),
	number: z
		.string()
		.optional()
		.meta({ examples: ['500'] }),
	district: z
		.string()
		.optional()
		.meta({ examples: ['Manhattan'] }),
	city: z
		.string()
		.optional()
		.meta({ examples: ['New York'] }),
	state: z
		.string()
		.optional()
		.meta({ examples: ['NY'] }),
	country: z
		.string()
		.optional()
		.meta({ examples: ['US'] }),
	latitude: z
		.string()
		.optional()
		.meta({ examples: ['40.7128'] }),
	longitude: z
		.string()
		.optional()
		.meta({ examples: ['-74.0060'] }),
	opening_hours: z
		.object({
			[openingDays[0]]: z.string().optional(),
			[openingDays[1]]: z.string().optional(),
			[openingDays[2]]: z.string().optional(),
			[openingDays[3]]: z.string().optional(),
			[openingDays[4]]: z.string().optional(),
			[openingDays[5]]: z.string().optional(),
			[openingDays[6]]: z.string().optional(),
		})
		.optional()
		.meta({
			examples: {
				Monday: '10:00',
				Tuesday: '11:00',
				Wednesday: '12:00',
				Thursday: '13:00',
				Friday: '14:00',
				Saturday: '15:00',
				Sunday: '16:00',
			},
		}),
	is_active: z
		.preprocess((val) => {
			if (val === 'true') return true;
			if (val === 'false') return false;
			return val;
		}, z.boolean())
		.optional()
		.meta({ examples: [true] }),
        skip: z.any().optional(),
        take: z.any().optional(),
});

export const StoreBodySchema = z.object({
	name: z.string().max(100, 'Nome da loja deve ter menos de 100 caracteres'),
	type: z.enum(storeType),
	email: z
		.email()
		.max(100, 'E-mail da loja deve ter menos de 100 caracteres'),
	phone: z.string(),
	street: z.string().max(100, 'Rua da loja deve ter menos de 100 caracteres'),
	number: z
		.string()
		.max(100, 'Número da loja deve ter menos de 100 caracteres'),
	district: z
		.string()
		.max(100, 'Bairro da loja deve ter menos de 100 caracteres'),
	city: z
		.string()
		.max(100, 'Cidade da loja deve ter menos de 100 caracteres'),
	state: z
		.string()
		.max(100, 'Estado da loja deve ter menos de 100 caracteres'),
	zip_code: z
		.string()
		.max(50, 'zip_code da loja deve ter menos de 50 caracteres'),
	country: z
		.string()
		.max(100, 'País da loja deve ter menos de 100 caracteres'),
	latitude: z
		.union([z.string(), z.number()])
		.transform((val) => new Decimal(val)),
	longitude: z
		.union([z.string(), z.number()])
		.transform((val) => new Decimal(val)),

	opening_hours: z
		.array(
			z
				.object({
					day: z.enum(openingDays, {
						error: 'Dia da semana inválido',
					}),
					open: z
						.string()
						.regex(
							timeRegex,
							'Horário de abertura deve estar no formato HH:mm (00:00–23:59)',
						),
					close: z
						.string()
						.regex(
							timeRegex,
							'Horário de fechamento deve estar no formato HH:mm (00:00–23:59)',
						),
				})
				.refine(
					({ open, close }) => {
						const [openH, openM] = open.split(':').map(Number);
						const [closeH, closeM] = close.split(':').map(Number);
						const openTotal = openH * 60 + openM;
						const closeTotal = closeH * 60 + closeM;

						return openTotal < closeTotal;
					},
					{
						message:
							'Horário de abertura deve ser menor que o de fechamento',
						path: ['close'],
					},
				),
		)
		.refine(
			(hours) => {
				const days = hours.map((h) => h.day);
				return new Set(days).size === days.length;
			},
			{
				message:
					'Não é permitido repetir dias da semana em opening_hours.',
			},
		),
});

export const StoreGetResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true).meta({
		description: 'Indica se a requisição foi bem-sucedida',
		examples: [true],
	}),
	message: z.string().meta({
		description: 'Mensagem de sucesso retornada pela API',
		examples: ['Informações da loja encontradas'],
	}),
	data: z.array(
		z.object({
			id: z
				.string()
				.meta({ examples: ['61ba0e5e-59e5-403b-bb76-e317011f7399'] }),
			name: z.string().meta({ examples: ['Example Twent'] }),
			code: z.string().meta({ examples: ['EXA001'] }),
			type: z.enum(storeType).meta({ examples: ['BRANCH'] }),
			email: z.string().meta({ examples: ['example@twent.com.br'] }),
			phone: z.string().meta({ examples: ['+55 11 9999-8888'] }),
			street: z.string().meta({ examples: ['St. Example'] }),
			number: z.string().meta({ examples: ['500'] }),
			district: z.string().meta({ examples: ['Manhattan'] }),
			city: z.string().meta({ examples: ['New York'] }),
			state: z.string().meta({ examples: ['NY'] }),
			zip_code: z.string().meta({ examples: ['01000-000'] }),
			country: z.string().meta({ examples: ['US'] }),
			latitude: z.any().meta({ examples: ['-23.56019'] }),
			longitude: z.any().meta({ examples: ['-46.67812'] }),
			opening_hours: z.array(
				z.object({
					day: z.enum(openingDays).meta({ examples: ['Monday'] }),
					open: z.string().meta({ examples: ['10:00'] }),
					close: z.string().meta({ examples: ['19:00'] }),
				}),
			),
			is_active: z.boolean().meta({ examples: [true] }),
			created_at: z
				.date()
				.meta({ examples: ['2025-10-07T18:55:04.196Z'] }),
			updated_at: z
				.date()
				.meta({ examples: ['2025-10-09T19:23:48.922Z'] }),
		}),
	),
});

export const StorePostResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Filial criada com sucesso'] }),
});

export const StorePutResponseSchema =  ApiResponseSchema.extend({
    success: z.literal(true),
    message: z.string().meta({ examples: ['Loja atualizada com sucesso'] }),
})

export const StoreChangeStatusResponseSchema = ApiResponseSchema.extend({
    success: z.literal(true),
    message: z
        .string()
        .meta({ examples: ['Status da loja atualizado com sucesso'] }),
})
export const StoreNotFoundSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Loja nao encontrada'] }),
	errorCode: z.string().meta({ examples: ['STORE_NOT_FOUND'] }),
});

export const StoreBadRequestSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Dados da loja inválidos'] }),
	errorCode: z.string().meta({ examples: ['BAD_REQUEST'] }),
});

export const StoreConflictSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Dados da loja conflitantes'] }),
	errorCode: z.string().meta({ examples: ['STORE_CONFLICT'] }),
});
