import { Decimal } from '@prisma/client/runtime/library';
import { PaymentMethod } from '@prisma/generated/enums';
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
	created_by: z.uuid(),
	created_at: z.date(),
});

export type Sale = z.infer<typeof SaleSchema>;

export const newSaleSchema = z.object({
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
	created_by: z.uuid(),
});

export type NewSale = z.infer<typeof newSaleSchema>;