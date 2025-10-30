import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';
import { ApiResponseSchema } from './api-response.schema';
import {
	CustomerBodySchema,
	CustomerQuerystringSchema,
} from './customer.schema';

export const EmployeeQuerystringSchema = CustomerQuerystringSchema.extend({
	national_id: z
		.string()
		.optional()
		.meta({
			description: 'Número de identificação nacional do funcionário',
			examples: ['AB123456C'],
		}),
	department: z
		.string()
		.optional()
		.meta({
			description: 'Departamento em que o funcionário trabalha',
			examples: ['Human Resources', 'Finance'],
		}),
	salary: z
		.union([z.string(), z.number(), z.instanceof(Decimal)])
		.transform((val) => (val instanceof Decimal ? val : new Decimal(val)))
		.meta({
			description: 'Salário do funcionário (convertido em Decimal)',
			examples: ['4200.75', 5100],
		})
		.optional(),
	currency: z
		.string()
		.optional()
		.meta({
			description: 'Moeda usada no salário',
			examples: ['USD', 'EUR', 'GBP'],
		}),
	benefits: z
		.any()
		.optional()
		.meta({
			description: 'Lista de benefícios do funcionário',
			examples: [['Health insurance', 'Meal voucher']],
		}),
	termination_date: z
		.date()
		.optional()
		.meta({
			description: 'Data de desligamento do funcionário, se aplicável',
			examples: ['2025-03-01T00:00:00.000Z'],
		}),
	emergency_contact: z
		.any()
		.optional()
		.meta({
			description: 'Informações de contato de emergência',
			examples: [{ name: 'Emma Johnson', phone: '+1 415-555-0199' }],
		}),
	is_active: z
		.preprocess((val) => {
			if (val === 'true') return true;
			if (val === 'false') return false;
			return val;
		}, z.boolean())
		.optional()
		.meta({ examples: [true] }),
});

export const EmployeeBodySchema = CustomerBodySchema.extend({
	national_id: z
		.string()
		.optional()
		.meta({
			description: 'Número de identificação nacional do funcionário',
			examples: ['AB123456C'],
		}),
	department: z
		.string()
		.optional()
		.meta({
			description: 'Departamento em que o funcionário trabalha',
			examples: ['Human Resources', 'Finance'],
		}),
	salary: z
		.union([z.string(), z.number(), z.instanceof(Decimal)])
		.transform((val) => (val instanceof Decimal ? val : new Decimal(val)))
		.meta({
			description: 'Salário do funcionário (convertido em Decimal)',
			examples: ['4200.75', 5100],
		}),
	currency: z
		.string()
		.optional()
		.meta({
			description: 'Moeda usada no salário',
			examples: ['USD', 'EUR', 'GBP'],
		}),
	benefits: z
		.any()
		.optional()
		.meta({
			description: 'Lista de benefícios do funcionário',
			examples: [['Health insurance', 'Meal voucher']],
		}),
	termination_date: z
		.date()
		.optional()
		.meta({
			description: 'Data de desligamento do funcionário, se aplicável',
			examples: ['2025-03-01T00:00:00.000Z'],
		}),
	emergency_contact: z
		.any()
		.optional()
		.meta({
			description: 'Informações de contato de emergência',
			examples: [{ name: 'Emma Johnson', phone: '+1 415-555-0199' }],
		}),
	is_active: z
		.boolean()
		.optional()
		.meta({
			description: 'Indica se o funcionário está ativo',
			examples: [true],
		}),
	role: z.string().meta({
		description: 'Papel do usuário',
		examples: ['MANAGER_HQ', 'EMPLOYEE_BRANCH'],
	}),
    store_code: z.string().meta({
        description: 'Código da loja',
        examples: ['CHE999'],
    }).optional()
});

export const EmployeeGetResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true).meta({
		description: 'Indica se a requisição foi bem-sucedida',
		examples: [true],
	}),
	message: z.string().meta({
		description: 'Mensagem de sucesso retornada pela API',
		examples: ['Informações do funcionário encontradas'],
	}),
	data: z
		.array(
			z.object({
				id: z.string().meta({ examples: ['emp_7b2f4a8d'] }),
				email: z
					.string()
					.meta({ examples: ['oliver.smith@example.com'] }),
				first_name: z.string().meta({ examples: ['Oliver'] }),
				last_name: z.string().meta({ examples: ['Smith'] }),
				phone: z
					.string()
					.nullable()
					.meta({ examples: ['+44 20 7946 0958', null] }),
				user_type: z.enum(['EMPLOYEE']).meta({
					description: 'Tipo de usuário (fixo: EMPLOYEE)',
				}),
				city: z
					.string()
					.nullable()
					.meta({ examples: ['London', null] }),
				state: z
					.string()
					.nullable()
					.meta({ examples: ['England', null] }),
				country: z
					.string()
					.nullable()
					.meta({ examples: ['United Kingdom', null] }),
				street: z
					.string()
					.nullable()
					.meta({ examples: ['10 Downing Street', null] }),
				is_active: z.boolean().meta({ examples: [true, false] }),
				employee: z
					.object({
						position: z
							.string()
							.nullable()
							.meta({ examples: ['Data Analyst', null] }),
						salary: z.any().meta({ examples: [5200.5] }),
						is_active: z.boolean().meta({ examples: [true] }),
					})
					.nullable()
					.meta({
						description:
							'Informações complementares do funcionário',
					}),
				user_roles: z
					.array(
						z.object({
							role: z.object({
								name: z
									.string()
									.meta({ examples: ['STORE_MANAGER'] }),
							}),
						}),
					)
					.meta({
						description: 'Lista de papéis atribuídos ao usuário',
					}),
				store: z
					.object({
						code: z.string().meta({ examples: ['ST101'] }),
						name: z
							.string()
							.meta({ examples: ['Main Store - New York'] }),
					})
					.meta({ description: 'Loja associada ao funcionário' }),
			}),
		)
		.meta({ description: 'Lista de funcionários encontrados' }),
});

export const EmployeePostResponseSchema = z.object({
	success: z.literal(true),
	message: z
		.string()
		.meta({ examples: ['Funcionário cadastrado com sucesso'] }),
});

export const EmployeePutResponseSchema = z.object({
	success: z.literal(true),
	message: z
		.string()
		.meta({ examples: ['Funcionário atualizado com sucesso'] }),
});

export const EmployeeBadRequestSchema = z.object({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Dados do funcionário inválidos'] }),
	errorCode: z.string().meta({ examples: ['BAD_REQUEST'] }),
});
