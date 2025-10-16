import { z } from 'zod';
import { UserType } from '@prisma/generated/enums';
import { ApiResponseSchema } from './api-response.schema';

const UserTypes: UserType[] = ['CUSTOMER', 'EMPLOYEE'];

export const UserSchema = z.object({
	email: z.email(),
	password_hash: z.string().min(6),
	first_name: z.string(),
	last_name: z.string(),
	phone: z.string().optional(),
	user_type: z.enum(UserTypes),
	document_number: z.string().optional(),
	birth_date: z.date().optional(),
	street: z.string().optional(),
	number: z.string().optional(),
	district: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zip_code: z.string().optional(),
	country: z.string().optional(),
	is_active: z.boolean().optional(),
});

export const UserGetResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z
		.string()
		.meta({ examples: ['Informações do usuário encontradas'] }),
	data: z.object({
		id: z.string(),
		email: z.string(),
		first_name: z.string(),
		last_name: z.string(),
		phone: z.string().nullable(),
		user_type: z.enum(UserTypes),
		document_number: z.string().nullable(),
		birth_date: z.string().nullable(),
		street: z.string().nullable(),
		number: z.string().nullable(),
		district: z.string().nullable(),
		city: z.string().nullable(),
		state: z.string().nullable(),
		zip_code: z.string().nullable(),
		country: z.string().nullable(),
		is_active: z.boolean().nullable(),
	}),
});

export const ChangeStatusResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Status do usuário atualizado'] }),
	data: z.object({
		id: z.string(),
		email: z.string(),
		first_name: z.string(),
		last_name: z.string(),
		user_type: z.enum(UserTypes),
		is_active: z.boolean(),
	}),
});

export const ChangeStatusBodySchema = z.object({
	newStatus: z
		.boolean()
		.meta({ examples: [true], description: 'Novo status do usuário' }),
});

export const ConflictStatusResponseSchema = ApiResponseSchema.extend({
    success: z.literal(false),
    message: z.string().meta({ examples: ['Status do usuário conflitante'] }),
    errorCode: z.string().meta({ examples: ['CONFLICT_STATUS'] }),
}).meta({
    description: 'Resposta para status do usuário conflitante (409).',
});