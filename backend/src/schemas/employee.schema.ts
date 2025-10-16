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