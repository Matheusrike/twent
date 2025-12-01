import { z } from 'zod';
import { ApiResponseSchema } from './api-response.schema';
import { BadRequestResponseSchema, ConflictResponseSchema, NotFoundResponseSchema, UuidSchema } from './generic.schema';

export const CashSessionQueryStringSchema = UuidSchema.extend({
    id: z.uuid('ID do usuário deve ser um UUID válido').meta({
        description: 'ID do usuário',
        examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
    }).optional(),
    cash_register_id: z.uuid('ID do caixa deve ser um UUID válido').meta({
        description: 'ID do caixa',
        examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
    }).optional()
})

export const CashRegisterParamsSchema = UuidSchema.extend({
	id: z.uuid('ID do caixa deve ser um UUID válido').meta({
		description: 'ID do caixa',
		examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
	}),
});

const CashRegisterSchema = z.object({
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

export const CashRegisterGetResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z
		.string()
		.meta({ examples: ['Informações do caixa encontradas'] }),
	data: z.array(CashRegisterSchema),
});

export const CashRegisterPostResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Caixa cadastrado com sucesso'] }),
	data: CashRegisterSchema,
});

export const CashRegisterPatchResponseSchema = ApiResponseSchema.extend({
	success: z.literal(true),
	message: z.string().meta({ examples: ['Caixa (des)ativado com sucesso'] }),
	data: CashRegisterSchema.omit({
		id: true,
		created_at: true,
		store_id: true,
	}),
});

export const CashSessionGetResponseSchema = ApiResponseSchema.extend({
    success: z.literal(true),
    message: z
        .string()
        .meta({ examples: ['Informações da sessão do caixa encontradas'] }),
    data: z.array(z.object({
        id: z.uuid().meta({
            description: 'ID da sessão do caixa',
            examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
        }),
        cashRegister: z.object({
            name: z.string().meta({
                description: 'Nome do caixa',
                examples: ['CR_1'],
            })
        }),
        user: z.object({
            id: z.uuid().meta({
                description: 'ID do usuário',
                examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
            }),
            first_name: z.string().meta({
                description: 'Nome de quem abriu o caixa',
                examples: ['John'],
            }),
            last_name: z.string().meta({
                description: 'Sobrenome de quem abriu o caixa',
                examples: ['Doe'],
            }),
        }),
        opening_amount: z.any().meta({
            description: 'Valor de abertura do caixa',
            examples: [1290.50],
        }),
        opend_at: z.coerce.date().meta({
            description: 'Data de abertura do caixa',
            examples: ['2022-01-01T00:00:00.000Z'],
        })
    })),
})

export const CashSessionPostResponseSchema = ApiResponseSchema.extend({
    success: z.literal(true),
    message: z.string().meta({ examples: ['Sessão do caixa aberta com sucesso'] }),
    data: z.object({
        id: z.uuid().meta({
            description: 'ID da sessão do caixa',
            examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
        }),
        cashRegister: z.object({
            name: z.string().meta({
                description: 'Nome do caixa',
                examples: ['CR_1'],
            })
        }),
        user_id: z.uuid().meta({
            description: 'ID do usuário',
            examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
        }),
        opening_amount: z.any().meta({
            description: 'Valor de abertura do caixa',
            examples: [1290.50],
        }),
        opened_at: z.coerce.date().meta({
            description: 'Data de abertura do caixa',
            examples: ['2022-01-01T00:00:00.000Z'],
        }),
        totalCashSales: z.any().meta({
            description: 'Total de vendas no caixa',
            examples: [1290.50],
        })
    }),
})

export const CloseCashSessionResponseSchema = CashRegisterPostResponseSchema.extend({
  closing_amount: z.any().meta({
    description: 'Valor de fechamento do caixa',
    examples: [1290.50],
  })  ,
    closed_at: z.coerce.date().meta({
        description: 'Data de fechamento do caixa',
        examples: ['2022-01-01T00:00:00.000Z'],
    }),

})
export const CashRegisterBadRequestSchema = BadRequestResponseSchema.extend({
	message: z.string().meta({ examples: ['Informações do caixa inválidas'] }),
});

export const CashRegisterNotFoundSchema = NotFoundResponseSchema.extend({
    message: z.string().meta({ examples: ['Caixa não encontrado'] }),
});

export const CashRegisterConflictSchema = ConflictResponseSchema.extend({
    message: z.string().meta({ examples: ['Caixa conflitante'] }),
})