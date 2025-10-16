import { z } from 'zod';
import { ApiResponseSchema } from './api-response.schema';

export const loginBodySchema = z.object({
	email: z.email().meta({
		description: 'Email do usuário',
		examples: ['user@email.com'],
	}),
	password: z
		.string('Senha deve ser uma string.')
		.trim()
		.meta({
			description: 'Senha do usuário.',
			examples: ['Exemplo123!', 'Senha@2023'],
		}),
});

// Responses Schemas

// Login Responses
export const LoginSuccessResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Login realizado com sucesso'] }),
	data: z
		.object({
			token: z.string().meta({
				description:
					'Token JWT para autenticação. Obs: Enviado apenas em ambiente de desenvolvimento.',
				examples: [
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
				],
			}),
		})
		.optional()
		.nullish(),
}).meta({
	description: `Resposta para login bem-sucedido (200).`,
});

export const UserNotFoundResponseSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Usuário não encontrado'] }),
	errorCode: z.string().meta({ examples: ['USER_NOT_FOUND'] }),
}).meta({
	description: 'Resposta para usuário não encontrado (404).',
});

export const UserInactiveResponseSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Usuário inativo'] }),
	errorCode: z.string().meta({ examples: ['USER_INACTIVE'] }),
}).meta({
	description: 'Resposta para usuário inativo (403).',
});

export const InvalidPasswordResponseSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Senha inválida'] }),
	errorCode: z.string().meta({ examples: ['INVALID_PASSWORD'] }),
}).meta({
	description: 'Resposta para senha inválida (401).',
});

// Logout Responses
export const LogoutSuccessResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Logout realizado com sucesso'] }),
}).meta({
	description: 'Resposta para logout bem-sucedido (200).',
});
