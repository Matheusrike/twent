import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';
import { ApiResponseSchema } from './api-response.schema';

export const EmployeeSchema = z.object({
	national_id: z
		.string()
		.optional()
		.meta({
			description: 'Número de identificação nacional do funcionário',
			examples: ['123.456.789-00'],
		}),
	department: z
		.string()
		.optional()
		.meta({
			description: 'Departamento em que o funcionário trabalha',
			examples: ['Recursos Humanos', 'Financeiro'],
		}),
	salary: z
		.union([z.string(), z.number()])
		.transform((val) => new Decimal(val))
		.meta({
			description: 'Salário do funcionário (convertido em Decimal)',
			examples: ['3500.50', 4200],
		}),
	currency: z
		.string()
		.optional()
		.meta({
			description: 'Moeda usada no salário',
			examples: ['BRL', 'USD'],
		}),
	benefits: z
		.any()
		.optional()
		.meta({
			description: 'Lista de benefícios do funcionário',
			examples: [['Vale-refeição', 'Plano de saúde']],
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
			examples: [{ name: 'Maria Silva', phone: '(11) 99999-9999' }],
		}),
	is_active: z
		.boolean()
		.optional()
		.meta({
			description: 'Indica se o funcionário está ativo',
			examples: [true],
		}),
});

export const EmployeeGetResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true).meta({
		description: 'Indica se a requisição foi bem-sucedida',
		examples: [true],
	}),
	message: z.string().meta({
		description: 'Mensagem de sucesso retornada pela API',
		examples: ['Informações do empregado encontradas'],
	}),
	data: z
		.array(
			z.object({
				id: z.string().meta({ examples: ['usr_12345'] }),
				email: z.string().meta({ examples: ['cFtZ4@example.com'] }),
				first_name: z.string().meta({ examples: ['Carlos'] }),
				last_name: z.string().meta({ examples: ['Ferreira'] }),
				phone: z
					.string()
					.nullable()
					.meta({ examples: ['+55 11 91234-5678', null] }),
				user_type: z.enum(['EMPLOYEE']).meta({
					description: 'Tipo de usuário (fixo: EMPLOYEE)',
				}),
				city: z
					.string()
					.nullable()
					.meta({ examples: ['São Paulo', null] }),
				state: z
					.string()
					.nullable()
					.meta({ examples: ['SP', null] }),
				country: z
					.string()
					.nullable()
					.meta({ examples: ['BR', null] }),
				street: z
					.string()
					.nullable()
					.meta({ examples: ['Rua das Flores, 123', null] }),
				is_active: z.boolean().meta({ examples: [true, false] }),
				employee: z
					.object({
						position: z
							.string()
							.nullable()
							.meta({ examples: ['Analista', null] }),
						salary: z.any().meta({ examples: [5000.0] }),
						is_active: z.boolean().meta({ examples: [true] }),
					})
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
									.meta({ examples: ['MANAGER_HQ'] }),
							}),
						}),
					)
					.meta({
						description: 'Lista de papéis atribuídos ao usuário',
					}),
				store: z
					.object({
						code: z.string().meta({ examples: ['ST001'] }),
						name: z.string().meta({ examples: ['Loja Central'] }),
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
	message: z
		.string()
		.meta({ examples: ['Informações do usuário inválidas'] }),
	errorCode: z.string().meta({ examples: ['BAD_REQUEST'] }),
});
