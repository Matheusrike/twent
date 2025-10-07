import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';
import { StoreType } from '../../prisma/generated/prisma/index.js';

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
export const StoreSchema = z.object({
	name: z.string().max(100, 'Nome da loja deve ter menos de 100 caracteres'),
	type: z.enum(storeType),
	email: z
		.string()
		.max(100, 'E-mail da loja deve ter menos de 100 caracteres'),
	phone: z
		.string()
		.max(100, 'Telefone da loja deve ter menos de 100 caracteres'),
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
		.max(100, 'CEP da loja deve ter menos de 100 caracteres'),
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
			z.object({
				day: z.enum(openingDays, {
					error: "Dia da semana inválido"
				}),
				open: z
					.string()
					.max(
						100,
						'Hora de abertura deve ter menos de 100 caracteres',
					),
				close: z
					.string()
					.max(
						100,
						'Hora de fechamento deve ter menos de 100 caracteres',
					),
			}),
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
