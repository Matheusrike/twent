import { z } from 'zod';
import { UserType } from '@prisma/generated/enums';
import { ApiResponseSchema } from './api-response.schema';
import { Decimal } from '@prisma/client/runtime/library';

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
		phone: z.string(),
		document_number: z.string(),
		birth_date: z.union([z.coerce.date(), z.null()]),
		street: z.union([z.null(), z.string()]),
		number: z.union([z.null(), z.string()]),
		district: z.union([z.null(), z.string()]),
		city: z.string(),
		state: z.string(),
		zip_code: z.union([z.null(), z.string()]),
		country: z.string(),
		reset_token: z.null(),
		reset_token_expires: z.null(),
		last_login_at: z.null(),
		is_active: z.boolean(),
		created_at: z.coerce.date(),
		updated_at: z.coerce.date(),
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
			.optional(),
		user_roles: z
			.array(z.object({ role: z.object({ name: z.string() }) }))
			.optional(),
		sales_created: z.array(z.any()).optional(),
		CustomerFavorite: z.array(z.any()).optional(),
	}),
});

export const changeStatusResponseSchema = ApiResponseSchema.extend({
    success: z.literal(true),
    message: z
        .string()
        .meta({ examples: ['Status alterado com sucesso'] }),
    data: z.object({
        id: z.string(),
        email: z.email(),
        first_name: z.string(), 
        last_name: z.string(),
        user_type: z.enum(UserTypes),
        is_active: z.boolean(),
    }),
})

export const ConflictStatusResponseSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z
		.string()
		.meta({ examples: ['Usuário já está ativado/desativado'] }),
	errorCode: z.string().meta({ examples: ['CONFLICT_STATUS'] }),
}).meta({
	description: 'Resposta para alteração de status conflitante (409).',
});
