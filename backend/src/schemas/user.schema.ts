import { z } from 'zod';
import { UserType } from '@prisma/generated/enums';
import { ApiResponseSchema } from './api-response.schema';

const UserTypes: UserType[] = ['CUSTOMER', 'EMPLOYEE'];

export const UserSchema = z.object({
	email: z.string().email().meta({
		examples: ['jane.doe@example.com'],
		description: 'User email address',
	}),
	password_hash: z.string().min(6).meta({
		examples: ['$2b$10$eImiTXuWVxfM37uY4JANjQ=='],
		description: 'Hashed user password',
	}),
	first_name: z.string().meta({
		examples: ['Jane'],
		description: 'User first name',
	}),
	last_name: z.string().meta({
		examples: ['Doe'],
		description: 'User last name',
	}),
	phone: z.string().optional().meta({
		examples: ['+1 202-555-0123'],
		description: 'User phone number (international format)',
	}),
	user_type: z.enum(UserTypes).meta({
		examples: ['EMPLOYEE'],
		description: 'User type (CUSTOMER or EMPLOYEE)',
	}),
	document_number: z.string().optional().meta({
		examples: ['A1234567'],
		description: 'Passport or document number',
	}),
	birth_date: z.date().optional().meta({
		examples: ['1992-03-15T00:00:00.000Z'],
		description: 'Birth date in ISO 8601 format',
	}),
	street: z.string().optional().meta({
		examples: ['221B Baker Street'],
		description: 'Street address',
	}),
	number: z.string().optional().meta({
		examples: ['221B'],
		description: 'Street number or identifier',
	}),
	district: z.string().optional().meta({
		examples: ['Marylebone'],
		description: 'District or neighborhood',
	}),
	city: z.string().optional().meta({
		examples: ['London'],
		description: 'City name',
	}),
	state: z.string().optional().meta({
		examples: ['England'],
		description: 'State, region, or province',
	}),
	zip_code: z.string().optional().meta({
		examples: ['NW1 6XE'],
		description: 'Postal or ZIP code',
	}),
	country: z.string().optional().meta({
		examples: ['United Kingdom'],
		description: 'Country name',
	}),
	is_active: z.boolean().optional().meta({
		examples: [true],
		description: 'Whether the user is active or not',
	}),
});

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

export const ChangeStatusBodySchema = z.object({
	newStatus: z.boolean().meta({
		examples: [false],
		description: 'New activation status for the user',
	}),
});

export const ChangeStatusResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z
		.string()
		.meta({ examples: ['User status updated successfully'] }),
	data: z.object({
		id: z.string().meta({ examples: ['f7b2e8a3-6a10-4d47-9e0b-6a8792e0d9d1'] }),
		email: z.string().meta({ examples: ['john.smith@example.com'] }),
		first_name: z.string().meta({ examples: ['John'] }),
		last_name: z.string().meta({ examples: ['Smith'] }),
		user_type: z.enum(UserTypes).meta({ examples: ['EMPLOYEE'] }),
		is_active: z.boolean().meta({ examples: [false] }),
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
