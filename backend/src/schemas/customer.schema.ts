import { z } from 'zod';
import { ApiResponseSchema } from './api-response.schema';

export const CustomerQueystringSchema = z.object({
	name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
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

export const CustomerGetResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z
		.string()
		.meta({ examples: ['Informações do usuário encontradas'] }),
	data: z.array(
		z.object({
			id: z.string(),
			email: z.string(),
			first_name: z.string(),
			last_name: z.string(),
			phone: z.string().nullable(),
			user_type: z.enum(['CUSTOMER']),
			document_number: z.string().nullable(),
			birth_date: z.string().nullable(),
			street: z.string().nullable(),
			number: z.string().nullable(),
			district: z.string().nullable(),
			city: z.string().nullable(),
			state: z.string().nullable(),
			country: z.string().nullable(),
			is_active: z.boolean().nullable(),
			created_at: z.date().nullable(),
		}),
	),
});

export const CustomerPostResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Usuário cadastrado'] }),
	data: z.object({
		id: z.string(),
		email: z.string(),
		first_name: z.string(),
		last_name: z.string(),
		phone: z.string().nullable(),
		user_type: z.enum(['CUSTOMER']),
		document_number: z.string().nullable(),
		birth_date: z.string().nullable(),
		street: z.string().nullable(),
		number: z.string().nullable(),
		district: z.string().nullable(),
		city: z.string().nullable(),
		state: z.string().nullable(),
		country: z.string().nullable(),
		zip_code: z.string().nullable(),
		is_active: z.boolean().nullable(),
		created_at: z.date().nullable(),
	}),
});

export const CustomerPutResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Usuário atualizado'] }),
	data: z.object({
		id: z.string(),
		email: z.string(),
		first_name: z.string(),
		last_name: z.string(),
		phone: z.string().nullable(),
		user_type: z.enum(['CUSTOMER']),
		document_number: z.string().nullable(),
		birth_date: z.string().nullable(),
		street: z.string().nullable(),
		number: z.string().nullable(),
		district: z.string().nullable(),
		city: z.string().nullable(),
		state: z.string().nullable(),
		country: z.string().nullable(),
		zip_code: z.string().nullable(),
		is_active: z.boolean().nullable(),
		created_at: z.date().nullable(),
	}),
});

export const CustomerBadRequestSchema = z.object({
	success: z.literal(false),
	message: z
		.string()
		.meta({ examples: ['Informações do usuário inválidas'] }),
	errorCode: z.string().meta({ examples: ['BAD_REQUEST'] }),
});

export const CustomerNotFoundSchema = z.object({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Usuário nao encontrado'] }),
	errorCode: z.string().meta({ examples: ['USER_NOT_FOUND'] }),
});

export const CustomerBadGatewaySchema = z.object({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Servidor externo indisponível'] }),
	errorCode: z.string().meta({ examples: ['BAD_GATEWAY'] }),
});

export const CustomerGatewayTimeoutSchema = z.object({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Tempo de espera excedido'] }),
	errorCode: z.string().meta({ examples: ['GATEWAY_TIMEOUT'] }),
});
