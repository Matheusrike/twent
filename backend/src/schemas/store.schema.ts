import { z } from 'zod';
import { StoreType } from '@prisma/generated/enums';
import { ApiResponseSchema } from './api-response.schema';
import { UuidSchema } from './generic.schema';
import { BadRequestResponseSchema, ConflictResponseSchema, NotFoundResponseSchema } from './generic.schema';

export const isoCountries = [
	'BR',
	'US',
	'CA',
	'ME',
	'AR',
	'CH',
	'CO',
	'GB',
	'DE',
	'FR',
	'ES',
	'IT',
	'NL',
	'CH',
	'CH',
	'IN',
	'JP',
	'AU',
	'SG',
	'KO',
	'AR',
	'VA',
];

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

export const StoreUUIDSchema = UuidSchema.extend({
	id: z.uuid().meta({ examples: ['61ba0e5e-59e5-403b-bb76-e317011f7399'] }),
});

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
		.enum(StoreType)
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

export type StoreQuerystring = z.infer<typeof StoreQuerystringSchema>;

export const createStoreSchema = z.object({
	name: z
		.string()
		.min(3, 'Nome deve ter pelo menos 3 caracteres.')
		.max(100, 'Nome da loja deve ter no máximo 100 caracteres')
		.meta({ examples: ['Twent Store'] }),

	type: z
		.enum(StoreType, { message: 'Tipo de loja inválido' })
		.meta({ examples: ['BRANCH'] }),

	email: z
		.email('Formato de e-mail inválido.')
		.toLowerCase()
		.max(100, 'E-mail da loja deve ter no máximo 100 caracteres')
		.meta({ examples: ['email@example.com'] }),

	phone: z
		.string()
		.regex(
			/^\+55 \d{2} 9?\d{4}-\d{4}$/,
			'Telefone deve seguir o padrão: +55 XX 9XXXX-XXXX',
		)
		.optional()
		.meta({ examples: ['+55 11 99999-8888', '+55 11 3003-0000'] }),

	street: z
		.string()
		.max(100, 'Rua da loja deve ter no máximo 100 caracteres')
		.meta({ examples: ['Rua Haddock Lobo'] }),
	number: z
		.string()
		.max(10, 'Número deve ter no máximo 10 caracteres')
		.meta({ examples: ['123', 'S/N', '123A'] }),
	district: z
		.string()
		.max(100, 'Bairro/Região deve ter no máximo 100 caracteres')
		.meta({ examples: ['Jardins', 'Manhattan'] }),
	city: z
		.string()
		.max(100, 'Cidade da loja deve ter no máximo 100 caracteres')
		.meta({ examples: ['São Paulo', 'New York'] }),

	state: z
		.string()
		.max(100, 'Estado/Província deve ter no máximo 100 caracteres')
		.meta({ examples: ['SP', 'NY', 'California'] }),

	zip_code: z
		.string()
		.max(20, 'O código postal deve ter no máximo 20 caracteres.')
		.min(2, 'O código postal não pode ser muito curto.')
		.regex(/^[a-z0-9\s-]+$/i, 'Código postal inválido.')
		.trim()
		.meta({ examples: ['SW1A 0AA', '10001'] }),

	country: z.enum(isoCountries).meta({ examples: ['BR', 'US', 'GB'] }),
	opening_hours: z.array(
			z.object({
					day: z.enum(openingDays, {
						error: 'Dia da semana inválido',
					}),
					open: z
						.string()
						.regex(
							timeRegex,
							'Horário de abertura deve estar no formato HH:mm (00:00–23:59)',
						)
						.meta({ examples: ['09:00'] }),
					close: z
						.string()
						.regex(
							timeRegex,
							'Horário de fechamento deve estar no formato HH:mm (00:00–23:59)',
						)
						.meta({ examples: ['18:00'] }),
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
		)
		.meta({
			examples: [
				{ day: 'MONDAY', open: '09:00', close: '18:00' },
				{ day: 'SATURDAY', open: '10:00', close: '14:00' },
			],
		}),
});

export type CreateStore = z.infer<typeof createStoreSchema>;

export const StoreGetResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true).meta({
		description: 'Indica se a requisição foi bem-sucedida',
		examples: [true],
	}),
	message: z.string().meta({
		description: 'Mensagem de sucesso retornada pela API',
		examples: ['Informações da loja encontradas'],
	}),
	data: z.object({
		id: z
			.string()
			.meta({ examples: ['61ba0e5e-59e5-403b-bb76-e317011f7399'] }),
		name: z.string().meta({ examples: ['Example Twent'] }),
		code: z.string().meta({ examples: ['EXA001'] }),
		type: z.enum(StoreType).meta({ examples: ['BRANCH'] }),
		email: z.string().meta({ examples: ['example@twent.com.br'] }),
		phone: z
			.string()
			.meta({ examples: ['+55 11 9999-8888'] })
			.nullable(),
		street: z.string().meta({ examples: ['St. Example'] }),
		number: z.string().meta({ examples: ['500'] }),
		district: z.string().meta({ examples: ['Manhattan'] }),
		city: z.string().meta({ examples: ['New York'] }),
		state: z.string().meta({ examples: ['NY'] }),
		zip_code: z.string().meta({ examples: ['01000-000'] }),
		country: z.string().meta({ examples: ['US'] }),
		latitude: z
			.any()
			.meta({ examples: ['-23.56019'] })
			.nullable(),
		longitude: z
			.any()
			.meta({ examples: ['-46.67812'] })
			.nullable(),
		opening_hours: z.array(
			z.object({
				day: z.enum(openingDays).meta({ examples: ['Monday'] }),
				open: z.string().meta({ examples: ['10:00'] }),
				close: z.string().meta({ examples: ['19:00'] }),
			}),
		),
		is_active: z.boolean().meta({ examples: [true] }),
		created_at: z.date().meta({ examples: ['2025-10-07T18:55:04.196Z'] }),
		updated_at: z.date().meta({ examples: ['2025-10-09T19:23:48.922Z'] }),
	}),
});

export const StoreGetAllResponseSchema = ApiResponseSchema.extend({
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
			type: z.enum(StoreType).meta({ examples: ['BRANCH'] }),
			email: z.string().meta({ examples: ['example@twent.com.br'] }),
			phone: z
				.string()
				.meta({ examples: ['+55 11 9999-8888'] })
				.nullable(),
			street: z.string().meta({ examples: ['St. Example'] }),
			number: z.string().meta({ examples: ['500'] }),
			district: z.string().meta({ examples: ['Manhattan'] }),
			city: z.string().meta({ examples: ['New York'] }),
			state: z.string().meta({ examples: ['NY'] }),
			zip_code: z.string().meta({ examples: ['01000-000'] }),
			country: z.string().meta({ examples: ['US'] }),
			latitude: z
				.any()
				.meta({ examples: ['-23.56019'] })
				.nullable(),
			longitude: z
				.any()
				.meta({ examples: ['-46.67812'] })
				.nullable(),
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
			sales: z.array(z.object({ 
                total: z.any() 
            })),
		}),
	),
});

export const StorePostResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Filial criada com sucesso'] }),
	data: z.object({
		id: z
			.string()
			.meta({ examples: ['61ba0e5e-59e5-403b-bb76-e317011f7399'] }),
		name: z.string().meta({ examples: ['Example Twent'] }),
		code: z.string().meta({ examples: ['EXA001'] }),
		type: z.enum(StoreType).meta({ examples: ['BRANCH'] }),
		email: z.string().meta({ examples: ['example@twent.com.br'] }),
		phone: z
			.string()
			.meta({ examples: ['+55 11 9999-8888'] })
			.nullable(),
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
		created_at: z.date().meta({ examples: ['2025-10-07T18:55:04.196Z'] }),
		updated_at: z.date().meta({ examples: ['2025-10-09T19:23:48.922Z'] }),
	}),
});

export const StorePutResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Loja atualizada com sucesso'] }),
});

export const StoreChangeStatusResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z
		.string()
		.meta({ examples: ['Status da loja alterado com sucesso'] }),
});
export const StoreNotFoundSchema = NotFoundResponseSchema.extend({
	message: z.string().meta({ examples: ['Loja nao encontrada'] }),
});

export const StoreBadRequestSchema = BadRequestResponseSchema.extend({
	message: z.string().meta({ examples: ['Dados da loja inválidos'] }),
});

export const StoreConflictSchema = ConflictResponseSchema.extend({
	message: z.string().meta({ examples: ['Dados da loja conflitantes'] }),
});
