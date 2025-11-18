import { Decimal } from '@prisma/client/runtime/library';
import { PaymentMethod, SaleStatus } from '@prisma/generated/enums';
import { z } from 'zod';

export const SaleSchema = z.object({
	id: z.uuid(),
	store_id: z.uuid(),
	cash_session_id: z.uuid(),
	customer_id: z.uuid(),
	subtotal: z
		.union([z.string(), z.number(), z.instanceof(Decimal)])
		.transform((val) => (val instanceof Decimal ? val : new Decimal(val)))
		.meta({
			description: 'Subtotal)',
			examples: ['4200.75', 5100],
		}),
	total: z
		.union([z.string(), z.number(), z.instanceof(Decimal)])
		.transform((val) => (val instanceof Decimal ? val : new Decimal(val)))
		.meta({
			description: 'Total',
			examples: ['4200.75', 5100],
		}),
	payment_method: z.enum(PaymentMethod),
	status: z.enum(SaleStatus),
	created_by: z.uuid(),
	created_at: z.date(),
});

export type Sale = z.infer<typeof SaleSchema>;

export const newSaleSchema = z.object({
    product_id: z.string(),
    quantity: z.number(),
    unit_price: z
        .union([z.string(), z.number(), z.instanceof(Decimal)])
        .transform((val) => (val instanceof Decimal ? val : new Decimal(val)))
        .meta({
            description: 'Preço unitário',
            examples: ['4200.75', 5100],
        }),
	cash_session_id: z.uuid(),
	customer_id: z.uuid().optional(),
	total_discount: z
		.union([z.string(), z.number(), z.instanceof(Decimal)])
		.transform((val) => (val instanceof Decimal ? val : new Decimal(val)))
		.meta({
			description: 'Desconto',
			examples: ['4200.75', 5100],
		}),
	product_discount: z
		.union([z.string(), z.number(), z.instanceof(Decimal)])
		.transform((val) => (val instanceof Decimal ? val : new Decimal(val)))
		.meta({
			description: 'Desconto',
			examples: ['4200.75', 5100],
		}),
	payment_method: z.enum(PaymentMethod),
});

export type NewSale = z.infer<typeof newSaleSchema>;

export const salesFiltersSchema = z.object({
	store_id: z.uuid().optional(),
	cash_session_id: z.uuid().optional(),
	customer_id: z.uuid().optional(),
	payment_method: z.enum(PaymentMethod).optional(),
	status: z.enum(SaleStatus).optional(),
	created_at: z.date().optional(),
});

export type SalesFilters = z.infer<typeof salesFiltersSchema>;
