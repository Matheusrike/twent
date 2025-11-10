import { z } from 'zod';
import { ApiResponseSchema } from './api-response.schema';
import { UserTypes } from './user.schema';

export const CustomerQuerystringSchema = z.object({
	first_name: z
		.string()
		.optional()
		.meta({
			examples: ['John'],
			description: 'Primeiro nome do usuário',
		}),
	last_name: z
		.string()
		.optional()
		.meta({
			examples: ['Doe'],
			description: 'Sobrenome do usuário',
		}),
	phone: z
		.string()
		.optional()
		.meta({
			examples: ['+1 415-555-2671'],
			description: 'Número de telefone no formato internacional',
		}),
	zip_code: z
		.string()
		.optional()
		.meta({
			examples: ['94105'],
			description: 'Código postal ou ZIP code',
		}),
	document_number: z
		.string()
		.optional()
		.meta({
			examples: ['P1234567'],
			description: 'Número de passaporte ou documento de identidade',
		}),
	id: z
		.string()
		.optional()
		.meta({
			examples: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'],
			description: 'ID único do usuário',
		}),
	email: z
		.email()
		.optional()
		.meta({
			examples: ['emma.smith@example.com'],
			description: 'Endereço de e-mail do usuário',
		}),
	country: z
		.string()
		.optional()
		.meta({
			examples: ['United Kingdom'],
			description: 'Nome do país',
		}),
	street: z
		.string()
		.optional()
		.meta({
			examples: ['221B Baker Street'],
			description: 'Nome da rua',
		}),
	city: z
		.string()
		.optional()
		.meta({
			examples: ['London'],
			description: 'Cidade do usuário',
		}),
	state: z
		.string()
		.optional()
		.meta({
			examples: ['England'],
			description: 'Estado, região ou província',
		}),
	is_active: z
		.preprocess((val) => {
			if (val === 'true') return true;
			if (val === 'false') return false;
			return val;
		}, z.boolean())
		.optional()
		.meta({ examples: [true] }),
	skip: z.any().optional(),
	take: z.any().optional(),
});

export const createCustomerSchema = z.object({
	email: z
		.email()
		.meta({
			examples: ['emily.watson@example.co.uk'],
			description: 'Endereço de e-mail do usuário',
		}),
	password_hash: z
		.string()
		.min(6)
		.meta({
			examples: ['$2b$10$eImiTXuWVxfM37uY4JANjQ=='],
			description: 'Senha do usuário em formato hash',
		}),
	first_name: z.string().meta({
		examples: ['Emily'],
		description: 'Primeiro nome do usuário',
	}),
	last_name: z.string().meta({
		examples: ['Watson'],
		description: 'Sobrenome do usuário',
	}),
	phone: z
		.string()
		.optional()
		.meta({
			examples: ['+44 20 7946 0958'],
			description: 'Número de telefone no formato internacional',
		}),
	user_type: z.enum(UserTypes).meta({
		examples: ['CUSTOMER'],
		description: 'Tipo de usuário (CUSTOMER ou EMPLOYEE)',
	}),
	document_number: z
		.string()
		.optional()
		.meta({
			examples: ['C9876543'],
			description: 'Número de passaporte ou documento de identidade',
		}),
	birth_date: z
		.preprocess(
			(val) => (val ? new Date(val as string) : undefined),
			z.date(),
		)
		.optional()
		.meta({
			examples: ['1988-11-02T00:00:00.000Z'],
			description: 'Data de nascimento no formato ISO 8601',
		}),
	street: z
		.string()
		.optional()
		.meta({
			examples: ['Unter den Linden'],
			description: 'Nome da rua',
		}),
	number: z
		.string()
		.optional()
		.meta({
			examples: ['77'],
			description: 'Número ou identificador do endereço',
		}),
	district: z
		.string()
		.optional()
		.meta({
			examples: ['Mitte'],
			description: 'Distrito ou bairro',
		}),
	city: z
		.string()
		.optional()
		.meta({
			examples: ['Berlin'],
			description: 'Cidade do usuário',
		}),
	state: z
		.string()
		.optional()
		.meta({
			examples: ['Berlin'],
			description: 'Estado, região ou província',
		}),
	zip_code: z
		.string()
		.optional()
		.meta({
			examples: ['10117'],
			description: 'Código postal ou ZIP code',
		}),
	country: z
		.string()
		.optional()
		.meta({
			examples: ['Germany'],
			description: 'Nome do país',
		}),
	is_active: z
		.boolean()
		.optional()
		.meta({
			examples: [true],
			description: 'Indica se o usuário está ativo ou não',
		}),
});

export type CreateCustomer = z.infer<typeof createCustomerSchema>;

const customerDataSchema = z.object({
	id: z.string().meta({ examples: ['f47ac10b-58cc-4372-a567-0e02b2c3d479'] }),
	email: z.email().meta({ examples: ['emily.watson@example.co.uk'] }),
	first_name: z.string().meta({ examples: ['Emily'] }),
	last_name: z.string().meta({ examples: ['Watson'] }),
	phone: z
		.string()
		.nullable()
		.meta({ examples: ['+44 20 7946 0958'] })
		.optional(),
	user_type: z.enum(['CUSTOMER']).meta({ examples: ['CUSTOMER'] }),
	document_number: z
		.string()
		.nullable()
		.meta({ examples: ['C9876543'] })
		.optional(),
	birth_date: z
		.string()
		.nullable()
		.meta({ examples: ['1988-11-02T00:00:00.000Z'] })
		.optional(),
	street: z
		.string()
		.nullable()
		.meta({ examples: ['Unter den Linden'] })
		.optional(),
	number: z
		.string()
		.nullable()
		.meta({ examples: ['77'] })
		.optional(),
	district: z
		.string()
		.nullable()
		.meta({ examples: ['Mitte'] })
		.optional(),
	city: z
		.string()
		.nullable()
		.meta({ examples: ['Berlin'] })
		.optional(),
	state: z
		.string()
		.nullable()
		.meta({ examples: ['Berlin'] })
		.optional(),
	country: z
		.string()
		.nullable()
		.meta({ examples: ['Germany'] })
		.optional(),
	zip_code: z
		.string()
		.nullable()
		.meta({ examples: ['10117'] })
		.optional(),
	is_active: z
		.boolean()
		.nullable()
		.meta({ examples: [true] })
		.optional(),
	created_at: z
		.date()
		.nullable()
		.meta({ examples: ['2025-10-23T14:00:00.000Z'] })
		.optional(),
});

export const CustomerGetResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z
		.string()
		.meta({ examples: ['Informações do usuário encontradas'] }),
	data: z.array(customerDataSchema),
});

export const CustomerPostResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Usuário cadastrado com sucesso'] }),
	data: customerDataSchema,
});

export const CustomerPutResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Usuário atualizado com sucesso'] }),
	data: customerDataSchema,
});

export const CustomerBadRequestSchema = z.object({
	success: z.literal(false),
	message: z
		.string()
		.meta({ examples: ['Informações do usuário inválidas'] }),
	errorCode: z.string().meta({ examples: ['BAD_REQUEST'] }),
});

export const CustomerNotFoundSchema = z.object({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Usuário não encontrado'] }),
	errorCode: z.string().meta({ examples: ['USER_NOT_FOUND'] }),
});

export const CustomerBadGatewaySchema = z.object({
	success: z.literal(false),
	message: z.string().meta({ examples: ['Servidor externo indisponível'] }),
	errorCode: z.string().meta({ examples: ['BAD_GATEWAY'] }),
});

export const CustomerGatewayTimeoutSchema = z.object({
	success: z.literal(false),
	message: z
		.string()
		.meta({ examples: ['Tempo de espera do servidor excedido'] }),
	errorCode: z.string().meta({ examples: ['GATEWAY_TIMEOUT'] }),
});
