import { Decimal } from '@prisma/client/runtime/library';
import { z } from 'zod';

export const EmployeeSchema = z.object({
    national_id: z.string().optional(),
    department: z.string().optional(),
    salary: z
        .union([z.string(), z.number()])
        .transform((val) => new Decimal(val)),
    currency: z.string().optional(),
    benefits: z.any().optional(),
    termination_date: z.date().optional(),
    emergency_contact: z.any().optional(),
    is_active: z.boolean().optional(),
});

export const EmployeeGetResponseSchema =  z.object({
    success: z.literal(true),
    message: z
        .string()
        .meta({ examples: ['Informações do usuário encontradas'] }),
    data: z.any(),
})

export const EmployeePostResponseSchema = z.object({
    success: z.literal(true),
    message: z.string().meta({ examples: ['Funcionario cadastrado'] }),
    data: z.any(),
});

export const EmployeeBadRequestSchema = z.object({
    success: z.literal(false),
    message: z
        .string()
        .meta({ examples: ['Informações do usuário inválidas'] }),
    errorCode: z.string().meta({ examples: ['BAD_REQUEST'] }),
});