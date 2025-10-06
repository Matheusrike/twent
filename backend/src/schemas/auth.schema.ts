import { z } from 'zod';
import { ApiResponseSchema } from './api-response.schema';

export const loginBodySchema = z.object({
	email: z.email(),
	password: z
		.string('Senha deve ser uma string.')
		.min(8, 'Senha deve ter no mínimo 8 caracteres.')
		.superRefine((password, ctx) => {
			if (!/[A-Z]/.test(password)) {
				ctx.addIssue({
					code: 'custom',
					message:
						'A senha deve conter pelo menos uma letra maiúscula.',
					pattern: '[A-Z]',
				});
				return;
			}
			if (!/[a-z]/.test(password)) {
				ctx.addIssue({
					code: 'custom',
					message:
						'A senha deve conter pelo menos uma letra minúscula.',
				});
				return;
			}
			if (!/[0-9]/.test(password)) {
				ctx.addIssue({
					code: 'custom',
					message: 'A senha deve conter pelo menos um número.',
				});
				return;
			}
			if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password)) {
				ctx.addIssue({
					code: 'custom',
					message:
						'A senha deve conter pelo menos um caractere especial.',
				});
				return;
			}
		})
		.trim()
		.describe('Senha do usuário')
		.meta({
			description:
				'A senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais.',
			examples: ['Exemplo123!', 'Senha@2023'],
		}),
});

// Responses Schemas
export const LoginSuccessResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.literal('Login realizado com sucesso.'),
	data: z
		.object({
			token: z
				.literal(
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
				)
				.describe('Token JWT para autenticação. '),
		})
		.describe(
			'Obs: O token JWT só é retornado no data se o servidor estiver configurado para ambiente de desenvolvimento.',
		),
}).meta({
	description: `Resposta para login bem-sucedido (200).`,
});

export const UserNotFoundResponseSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z.literal('Usuário não encontrado.'),
	errorCode: z.literal('USER_NOT_FOUND'),
}).meta({
	description: 'Resposta para usuário não encontrado (404).',
});

export const UserInactiveResponseSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z.literal('Usuário inativo.'),
	errorCode: z.literal('USER_INACTIVE'),
}).meta({
	description: 'Resposta para usuário inativo (403).',
});

export const InvalidPasswordResponseSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z.literal('Senha inválida.'),
	errorCode: z.literal('INVALID_PASSWORD'),
}).meta({
	description: 'Resposta para senha inválida (401).',
});
