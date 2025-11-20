import z from 'zod';
import { ApiResponseSchema } from './api-response.schema';

export const UuidSchema = z.object({
	id: z.uuid('ID ser um UUID válido').meta({
		description: 'ID da coleção',
		examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
	}),
});

export const BadRequestResponseSchema = ApiResponseSchema.extend({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Informações inválidas'] }),
	errorCode: z.string().meta({ examples: ['BAD_REQUEST'] }),
});

export const ConflictResponseSchema = ApiResponseSchema.extend({
    success: z.literal(false),
    message: z.string().meta({ examples: ['Informações conflitantes'] }),
    errorCode: z.string().meta({ examples: ['CONFLICT'] }),
});

export const NotFoundResponseSchema = ApiResponseSchema.extend({
    success: z.literal(false),
    message: z.string().meta({ examples: ['Informações não encontradas'] }),
    errorCode: z.string().meta({ examples: ['NOT_FOUND'] }),
})

export const BadGatewayResponseSchema = ApiResponseSchema.extend({
    success: z.literal(false),
    message: z.string().meta({ examples: ['Tempo de espera do servidor excedido'] }),
    errorCode: z.string().meta({ examples: ['GATEWAY_TIMEOUT'] }),
})

export const GatewayTimeoutResponseSchema = ApiResponseSchema.extend({
    success: z.literal(false),
    message: z.string().meta({ examples: ['Tempo de espera do servidor excedido'] }),
    errorCode: z.string().meta({ examples: ['GATEWAY_TIMEOUT'] }),
})

export const SkuSchema = z.object({
	sku: z
		.string()
		.min(1)
		.max(100)
		.regex(/^TW-\d{4}-\d+$/, 'O SKU deve seguir o formato TW-YYYY-NNNNN')
		.meta({
			description: 'SKU do produto',
			examples: ['ABC123', 'XYZ789'],
		}),
});

export type UuidType = z.infer<typeof UuidSchema>;
export type SkuType = z.infer<typeof SkuSchema>;
