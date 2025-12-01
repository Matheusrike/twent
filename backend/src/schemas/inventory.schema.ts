import { z } from 'zod';

export const InventorySchema = z.object({
	id: z.uuid().meta({
		description: 'ID do inventário',
		examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
	}),
	product_id: z.uuid().meta({
		description: 'ID do produto',
		examples: ['a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'],
	}),
	quantity: z
		.number()
		.int()
		.nonnegative()
		.meta({
			description: 'Quantidade em estoque',
			examples: [10],
		}),
	store_id: z.uuid().meta({
		description: 'ID da loja',
		examples: ['z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4'],
	}),
	minimum_stock: z
		.number()
		.int()
		.nonnegative()
		.meta({
			description: 'Estoque mínimo para reabastecimento',
			examples: [5],
		}),
	updated_at: z.date().meta({
		description: 'Data e hora da última atualização do inventário',
		examples: ['2024-01-01T12:00:00Z'],
	}),
});

export const createInventorySchema = z.object({
	product_id: z.uuid().meta({
		description: 'ID do produto',
		examples: ['a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'],
	}),
	quantity: z
		.number()
		.int()
		.nonnegative()
		.meta({
			description: 'Quantidade em estoque',
			examples: [10],
		}),
	minimum_stock: z
		.number()
		.int()
		.nonnegative()
		.meta({
			description: 'Estoque mínimo para reabastecimento',
			examples: [5],
		}),
});

export const inventoryAddRemoveSchema = z.object({
    id: z.uuid().meta({
        description: 'ID do inventário',
        examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
    }),
	// productId: z.uuid().meta({
	// 	description: 'ID do produto',
	// 	examples: ['a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'],
	// }),
	// storeId: z.uuid().meta({
	// 	description: 'ID da loja',
	// 	examples: ['z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4'],
	// }),
	quantity: z
		.number()
		.int()
		.nonnegative()
		.meta({
			description: 'Quantidade a adicionar ou remover do estoque',
			examples: [5],
		}),
});

export const inventoryTransactionSchema =  z.object({
   fromStoreId: z.uuid().meta({
      description: 'ID da loja de origem',
      examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
   }),
    toStoreId: z.uuid().meta({
        description: 'ID do inventário de destino',
        examples: ['a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6'],
    }),
    productId: z.uuid().meta({
        description: 'ID do produto a ser transferido',
        examples: ['z9y8x7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4'],
    }),
    quantity: z.number().int().nonnegative().meta({
        description: 'Quantidade a transferir',
        examples: [10],
    }),
});
    

export type InventoryType = z.infer<typeof InventorySchema>;
export type CreateInventoryType = z.infer<typeof createInventorySchema>;
export type InventoryAddRemoveType = z.infer<typeof inventoryAddRemoveSchema>;
export type InventoryTransactionType = z.infer<typeof inventoryTransactionSchema>;
