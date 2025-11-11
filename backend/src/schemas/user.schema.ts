import { z } from 'zod';
import { UserType } from '@prisma/generated/enums';
import { ApiResponseSchema } from './api-response.schema';

export const UserTypes: UserType[] = ['CUSTOMER', 'EMPLOYEE'];

export const UserGetResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z
		.string()
		.meta({ examples: ['User information retrieved successfully'] }),
	data: z.object({
		id: z.string().meta({ examples: ['f7b2e8a3-6a10-4d47-9e0b-6a8792e0d9d1'] }),
		email: z.string().meta({ examples: ['jane.doe@example.com'] }),
		first_name: z.string().meta({ examples: ['Jane'] }),
		last_name: z.string().meta({ examples: ['Doe'] }),
		phone: z.string().nullable().meta({ examples: ['+1 202-555-0123'] }),
		user_type: z.enum(UserTypes).meta({ examples: ['CUSTOMER'] }),
		document_number: z.string().nullable().meta({ examples: ['A1234567'] }),
		birth_date: z.string().nullable().meta({ examples: ['1992-03-15T00:00:00.000Z'] }),
		street: z.string().nullable().meta({ examples: ['221B Baker Street'] }),
		number: z.string().nullable().meta({ examples: ['221B'] }),
		district: z.string().nullable().meta({ examples: ['Marylebone'] }),
		city: z.string().nullable().meta({ examples: ['London'] }),
		state: z.string().nullable().meta({ examples: ['England'] }),
		zip_code: z.string().nullable().meta({ examples: ['NW1 6XE'] }),
		country: z.string().nullable().meta({ examples: ['United Kingdom'] }),
		is_active: z.boolean().nullable().meta({ examples: [true] }),
	}),
});

export const ConflictStatusResponseSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z
		.string()
		.meta({ examples: ['Usuário já está ativado/desativado'] }),
	errorCode: z
		.string()
		.meta({ examples: ['CONFLICT_STATUS'] }),
}).meta({
	description: 'Resposta para alteração de status conflitante (409).',
});
