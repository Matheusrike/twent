import { z } from 'zod';
import { Decimal } from '@prisma/client/runtime/library';
import { StoreType } from '../../prisma/generated/prisma/index.js';

const storeType = StoreType;
export const StoreSchema = z.object({
    name: z
        .string()
        .max(100, 'Store name must be less than 100 characters'),
    code: z
        .string()
        .max(100, 'Store code must be less than 100 characters')
        ,
    type: z.enum(storeType),
    email: z    
        .string()
        .max(100, 'Store email must be less than 100 characters'),
    phone: z
        .string()
        .max(100, 'Store phone must be less than 100 characters')
        ,
    street: z
        .string()
        .max(100, 'Store street must be less than 100 characters'),
    number: z
        .string()
        .max(100, 'Store number must be less than 100 characters'),
    district: z
        .string()
        .max(100, 'Store district must be less than 100 characters')
        ,
    city: z
        .string()
        .max(100, 'Store city must be less than 100 characters'),
    state: z
        .string()
        .max(100, 'Store state must be less than 100 characters'),
    zip_code: z
        .string()
        .max(100, 'Store zip code must be less than 100 characters'),
    country: z
        .string()
        .max(100, 'Store country must be less than 100 characters'),
	latitude: z
		.union([z.string(), z.number()])
		.transform((val) => new Decimal(val)),
	longitude: z
		.union([z.string(), z.number()])
		.transform((val) => new Decimal(val)),
	opening_hours: z.array(
		z.object({
			day: z
				.string()
				.max(100, 'Opening hour day must be less than 100 characters')
				,
			open: z
				.string()
				.max(100, 'Opening hour open must be less than 100 characters')
				,
			close: z
				.string()
				.max(100, 'Opening hour close must be less than 100 characters')
				,
		}),
	),
});
