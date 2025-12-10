import { z } from 'zod';

export interface IFinancialTransactionFilters {
	type?: string;
	category?: string;
	store_id?: string;
	supplier_id?: string;
	start_date?: Date;
	end_date?: Date;
	min_amount?: number;
	max_amount?: number;
}

export const createFinancialTransactionSchema = z.object({
	store_id: z.uuid('ID da loja deve ser um UUID válido').meta({
		description: 'ID da loja onde a transação ocorreu',
		examples: ['a3bb88f5-1c4d-4e2b-9f3a-123456789abc'],
	}).optional(),

	supplier_id: z
		.uuid('ID do fornecedor deve ser um UUID válido')
		.optional()
		.meta({
			description:
				'ID do fornecedor (apenas para despesas com fornecedores)',
			examples: ['b4cc99g6-2d5e-5f3c-0g4b-234567890bcd'],
		}),

	type: z
		.enum(['INCOME', 'EXPENSE'], 'Tipo deve ser INCOME ou EXPENSE')
		.meta({
			description: 'Tipo da transação: entrada ou saída',
			examples: ['INCOME', 'EXPENSE'],
		}),

	category: z
		.string('Categoria é obrigatória')
		.min(2, 'Categoria deve ter no mínimo 2 caracteres')
		.max(100, 'Categoria deve ter no máximo 100 caracteres')
		.meta({
			description: 'Categoria da transação',
			examples: ['Vendas', 'Fornecedores', 'Salários', 'Aluguel'],
		}),

	amount: z
		.number('Valor é obrigatório')
		.positive('Valor deve ser positivo')
		.meta({
			description: 'Valor da transação',
			examples: [1500.5, 2500],
		}),

	currency: z
		.string()
		.length(3, 'Moeda deve seguir o padrão ISO 4217 (ex: USD, BRL)')
		.default('USD')
		.meta({
			description: 'Moeda da transação',
			examples: ['USD', 'BRL', 'EUR'],
		}),

	description: z
		.string('Descrição é obrigatória')
		.min(5, 'Descrição deve ter no mínimo 5 caracteres')
		.max(500, 'Descrição deve ter no máximo 500 caracteres')
		.meta({
			description: 'Descrição detalhada da transação',
			examples: ['Venda de relógios', 'Pagamento de aluguel'],
		}),

	reference_type: z
		.string()
		.max(100, 'Tipo de referência deve ter no máximo 100 caracteres')
		.optional()
		.meta({
			description: 'Tipo de documento/referência',
			examples: ['sale', 'invoice', 'payment'],
		}),

	reference_id: z
		.string()
		.max(255, 'ID de referência deve ter no máximo 255 caracteres')
		.optional()
		.meta({
			description: 'ID do documento/referência',
			examples: ['SALE-2025-001', 'INV-123456'],
		}),

	transaction_date: z.iso
		.date('Data deve estar no formato ISO 8601')
		.transform((str) => new Date(str))
		.meta({
			description: 'Data da transação',
			examples: ['2025-01-15'],
		}),
});

export const updateFinancialTransactionSchema = z.object({
	supplier_id: z
		.string()
		.uuid('ID do fornecedor deve ser um UUID válido')
		.optional(),

	type: z
		.enum(['INCOME', 'EXPENSE'], 'Tipo deve ser INCOME ou EXPENSE')
		.optional(),

	category: z
		.string()
		.min(2, 'Categoria deve ter no mínimo 2 caracteres')
		.max(100, 'Categoria deve ter no máximo 100 caracteres')
		.optional(),

	amount: z.number().positive('Valor deve ser positivo').optional(),

	currency: z
		.string()
		.length(3, 'Moeda deve seguir o padrão ISO 4217')
		.optional(),

	description: z
		.string()
		.min(5, 'Descrição deve ter no mínimo 5 caracteres')
		.max(500, 'Descrição deve ter no máximo 500 caracteres')
		.optional(),

	reference_type: z
		.string()
		.max(100, 'Tipo de referência deve ter no máximo 100 caracteres')
		.optional(),

	reference_id: z
		.string()
		.max(255, 'ID de referência deve ter no máximo 255 caracteres')
		.optional(),

	transaction_date: z.iso
		.date('Data deve estar no formato ISO 8601')
		.transform((str) => new Date(str))
		.optional(),
});

export type CreateFinancialTransactionType = z.infer<
	typeof createFinancialTransactionSchema
>;
export type UpdateFinancialTransactionType = z.infer<
	typeof updateFinancialTransactionSchema
>;
