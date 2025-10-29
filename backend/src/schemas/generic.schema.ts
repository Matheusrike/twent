import z from 'zod';

export const UuidSchema = z.object({
	id: z.uuid('ID ser um UUID válido').meta({
		description: 'ID da coleção',
		examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
	}),
});

export type UuidType = z.infer<typeof UuidSchema>;
