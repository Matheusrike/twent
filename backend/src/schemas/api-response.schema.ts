import { z } from 'zod';

export const ApiResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	data: z.any().optional(),
	errors: z.any().optional(),
	errorCode: z.string().optional(),
});
