import { z } from 'zod';

export const ApiResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
});

export const ApiGenericErrorSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z.literal('Ocorreu um erro interno no servidor.'),
	errorCode: z.literal('INTERNAL_SERVER_ERROR'),
	errors: z.array(z.string()).optional(),
}).meta({
	description: 'Resposta genérica para erros internos do servidor (500).',
});
