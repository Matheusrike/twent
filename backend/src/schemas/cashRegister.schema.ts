import { z } from 'zod';

export const CashRegisterSchema = z.object({
	id: z.uuid().meta({
		description: 'ID do caixa',
		examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
	}),
	store_id: z.uuid().meta({
		description: 'ID da loja',
		examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
	}),
	name: z.string().meta({
		description: 'Nome do caixa',
		examples: ['Caixa_1'],
	}),
	is_active: z
		.preprocess((val) => {
			if (val === 'true') return true;
			if (val === 'false') return false;
			return val;
		}, z.boolean())
		.optional()
		.meta({ examples: [true] }),
	created_at: z.coerce.date().meta({
		description: 'Data de criação do caixa',
		examples: ['2022-01-01T00:00:00.000Z'],
	}),
});

export type CashRegister = z.infer<typeof CashRegisterSchema>;

export const createCashRegisterSchema = CashRegisterSchema.omit({
	id: true,
	is_active: true,
	created_at: true,
});
