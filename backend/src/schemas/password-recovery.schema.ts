import { z } from 'zod';

export const requestPasswordResetSchema = z.object({
	email: z
		.email('Email é obrigatório e deve ser válido')
		.toLowerCase()
		.meta({
			description: 'Email do usuário que deseja recuperar a senha',
			examples: ['usuario@example.com'],
		}),
});

export const validateTokenSchema = z.object({
	token: z.string('Token é obrigatório').length(64, 'Token inválido').meta({
		description: 'Token de recuperação de senha',
	}),
});

export const resetPasswordSchema = z
	.object({
		token: z
			.string('Token é obrigatório')
			.length(64, 'Token inválido')
			.meta({
				description: 'Token de recuperação de senha',
			}),

		password: z
			.string('Senha é obrigatória')
			.min(8, 'A senha deve ter no mínimo 8 caracteres')
			.max(100, 'A senha deve ter no máximo 100 caracteres')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
				'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
			)
			.meta({
				description: 'Nova senha do usuário',
				examples: ['SenhaForte@123'],
			}),

		password_confirmation: z
			.string('Confirmação de senha é obrigatória')
			.meta({
				description: 'Confirmação da nova senha',
			}),
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: 'As senhas não correspondem',
		path: ['password_confirmation'],
	});

export type RequestPasswordResetType = z.infer<
	typeof requestPasswordResetSchema
>;
export type ValidateTokenType = z.infer<typeof validateTokenSchema>;
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
