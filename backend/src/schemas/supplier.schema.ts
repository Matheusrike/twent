import { z } from 'zod';

export interface ISupplierFilters {
	name?: string;
	email?: string;
	contact_name?: string;
	city?: string;
	state?: string;
	country?: string;
	is_active?: boolean;
}

export const createSupplierSchema = z.object({
	name: z
		.string('O nome do fornecedor é obrigatório')
		.min(2, 'O nome deve ter no mínimo 2 caracteres')
		.max(255, 'O nome deve ter no máximo 255 caracteres')
		.meta({
			description: 'Nome do fornecedor',
			examples: ['Fornecedor LTDA', 'Distribuidora XYZ'],
		}),

	contact_name: z
		.string('O nome do contato é obrigatório')
		.min(2, 'O nome do contato deve ter no mínimo 2 caracteres')
		.max(255, 'O nome do contato deve ter no máximo 255 caracteres')
		.meta({
			description: 'Nome da pessoa de contato',
			examples: ['João Silva', 'Maria Santos'],
		}),

	email: z
		.string('O email é obrigatório')
		.email('Email inválido')
		.max(255, 'O email deve ter no máximo 255 caracteres')
		.meta({
			description: 'Email de contato do fornecedor',
			examples: ['contato@fornecedor.com', 'vendas@distribuidora.com'],
		}),

	phone: z
		.string('O telefone é obrigatório')
		.min(10, 'O telefone deve ter no mínimo 10 caracteres')
		.max(20, 'O telefone deve ter no máximo 20 caracteres')
		.regex(
			/^\+?(\d{1,3})?[-.\s]?(\(?\d{2,3}\)?[-.\s]?)?(\d[-.\s]?){6,9}\d$/,
			'Formato de telefone inválido',
		)
		.meta({
			description: 'Telefone de contato',
			examples: ['(11) 98765-4321', '+55 11 3456-7890'],
		}),

	document_number: z
		.string()
		.min(14, 'O CNPJ deve ter no mínimo 14 caracteres')
		.max(14, 'O CNPJ deve ter no máximo 14 caracteres')
		.meta({
			description: 'Número do documento CNPJ)',
			examples: ['12345678000199'],
		}),

	street: z
		.string()
		.min(3, 'O logradouro deve ter no mínimo 3 caracteres')
		.max(255, 'O logradouro deve ter no máximo 255 caracteres')
		.optional()
		.meta({
			description: 'Logradouro do endereço',
			examples: ['Rua das Flores', 'Avenida Paulista'],
		}),

	number: z
		.string()
		.max(20, 'O número deve ter no máximo 20 caracteres')
		.optional()
		.meta({
			description: 'Número do endereço',
			examples: ['123', '456-A', 'S/N'],
		}),

	district: z
		.string()
		.max(100, 'O bairro deve ter no máximo 100 caracteres')
		.optional()
		.meta({
			description: 'Bairro',
			examples: ['Centro', 'Jardim Paulista'],
		}),

	city: z
		.string()
		.max(100, 'A cidade deve ter no máximo 100 caracteres')
		.optional()
		.meta({
			description: 'Cidade',
			examples: ['São Paulo', 'Rio de Janeiro'],
		}),

	state: z
		.string()
		.max(100, 'O estado deve ter no máximo 100 caracteres')
		.optional()
		.meta({
			description: 'Estado',
			examples: ['SP', 'RJ'],
		}),

	zip_code: z
		.string()
		.regex(/^\d{5}-?\d{3}$/, 'Formato de CEP inválido')
		.optional()
		.meta({
			description: 'CEP do endereço',
			examples: ['01310-100', '20040-020'],
		}),

	country: z
		.string()
		.max(100, 'O país deve ter no máximo 100 caracteres')
		.optional()
		.meta({
			description: 'País',
			examples: ['Brasil', 'Argentina'],
		}),
});

export const updateSupplierSchema = z.object({
	name: z
		.string()
		.min(2, 'O nome deve ter no mínimo 2 caracteres')
		.max(255, 'O nome deve ter no máximo 255 caracteres')
		.optional(),

	contact_name: z
		.string()
		.min(2, 'O nome do contato deve ter no mínimo 2 caracteres')
		.max(255, 'O nome do contato deve ter no máximo 255 caracteres')
		.optional(),

	email: z
		.string()
		.email('Email inválido')
		.max(255, 'O email deve ter no máximo 255 caracteres')
		.optional(),

	phone: z
		.string()
		.min(10, 'O telefone deve ter no mínimo 10 caracteres')
		.max(20, 'O telefone deve ter no máximo 20 caracteres')
		.regex(
			/^\+?(\d{1,3})?[-.\s]?(\(?\d{2,3}\)?[-.\s]?)?(\d[-.\s]?){6,9}\d$/,
			'Formato de telefone inválido',
		)
		.optional(),

	street: z
		.string()
		.min(3, 'O logradouro deve ter no mínimo 3 caracteres')
		.max(255, 'O logradouro deve ter no máximo 255 caracteres')
		.optional(),

	number: z
		.string()
		.max(20, 'O número deve ter no máximo 20 caracteres')
		.optional(),

	district: z
		.string()
		.max(100, 'O bairro deve ter no máximo 100 caracteres')
		.optional(),

	city: z
		.string()
		.max(100, 'A cidade deve ter no máximo 100 caracteres')
		.optional(),

	state: z
		.string()
		.max(100, 'O estado deve ter no máximo 100 caracteres')
		.optional(),

	zip_code: z
		.string()
		.regex(/^\d{5}-?\d{3}$/, 'Formato de CEP inválido')
		.optional(),

	country: z
		.string()
		.max(100, 'O país deve ter no máximo 100 caracteres')
		.optional(),

	is_active: z
		.boolean()
		.optional()
		.meta({
			description: 'Status de ativação do fornecedor',
			examples: [true, false],
		}),
});

export type CreateSupplierType = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierType = z.infer<typeof updateSupplierSchema>;
