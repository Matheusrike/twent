import { z } from 'zod';
import { UserType } from '@prisma/generated/enums';
import { ApiResponseSchema } from './api-response.schema';
import { Decimal } from '@prisma/client/runtime/library';
import { ConflictResponseSchema } from './generic.schema';

export const UserTypes: UserType[] = ['CUSTOMER', 'EMPLOYEE'];

export const getUserInfoResponse = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z
		.string()
		.meta({ examples: ['User information retrieved successfully'] }),
	data: z.object({
		id: z.string(),
		store_id: z.union([z.null(), z.string()]),
		user_type: z.string(),
		email: z.string(),
		first_name: z.string(),
		last_name: z.string(),
		phone: z.string().nullable(),
		document_number: z.string().nullable(),
		birth_date: z.union([z.coerce.date(), z.null()]).nullable(),
		street: z.union([z.null(), z.string()]).nullable(),
		number: z.union([z.null(), z.string()]).nullable(),
		district: z.union([z.null(), z.string()]).nullable(),
		city: z.string().nullable(),
		state: z.string().nullable(),
		zip_code: z.union([z.null(), z.string()]).nullable(),
		country: z.string().nullable(),
		reset_token: z.string().optional().nullable(),
		reset_token_expires: z.string().optional().nullable(),
		last_login_at: z.date().nullable(),
		is_active: z.boolean(),
		created_at: z.coerce.date(),
		updated_at: z.coerce.date(),
		store: z
			.object({
				name: z.string(),
			})
			.optional()
			.nullable(),
		employee: z
			.object({
				position: z.string(),
				salary: z
					.union([z.string(), z.number(), z.instanceof(Decimal)])
					.transform((val) =>
						val instanceof Decimal ? val : new Decimal(val),
					)
					.meta({
						description:
							'Salário do funcionário (convertido em Decimal)',
						examples: ['4200.75', 5100],
					})
					.nullable(),
				benefits: z.any().nullable(),
				hire_date: z.coerce.date(),
				is_active: z.boolean(),
				leaves: z.array(z.any()),
			})
			.optional()
			.nullable(),
		user_roles: z
			.array(z.object({ role: z.object({ name: z.string() }) }))
			.optional(),
		sales_created: z.array(z.any()).optional(),
		CustomerFavorite: z.array(z.any()).optional(),
	}),
});

export const changeStatusResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Status alterado com sucesso'] }),
	data: z.object({
		id: z.string(),
		email: z.email(),
		first_name: z.string(),
		last_name: z.string(),
		user_type: z.enum(UserTypes),
		is_active: z.boolean(),
	}),
});

export const ConflictStatusResponseSchema = ConflictResponseSchema.extend({
	message: z
		.string()
		.meta({ examples: ['Informações do usuário conflitantes'] }),
});
