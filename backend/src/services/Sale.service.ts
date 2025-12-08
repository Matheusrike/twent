import { NewSale, SalesFilters } from '@/schemas/sale.schema';
import { AppError } from '@/utils/errors.util';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaClient } from '@prisma/generated/client';

export class SaleService {
	constructor(private database: PrismaClient) {}

	async newSale(data: NewSale, store_id: string, id: string) {
		try {
			if (data.customer_id) {
				const customerExists = await this.database.user.findUnique({
					where: {
						id: data.customer_id,
					},
				});
				if (!customerExists) {
					throw new AppError({
						message: 'Cliente nao encontrado',
						errorCode: 'NOT_FOUND',
					});
				}
			}
                const product = await this.database.product.findUnique({
					where: {
						sku: data.product_id,
					},
                    select: {
                        price: true
                    }
				}); 
			const subtotal =
				Number(data.quantity) * Number(product!.price) -
				Number(data.product_discount);
			const total = Number(subtotal) - Number(data.total_discount);
			const response = await this.database.$transaction(async (tx) => {
            
				const sale = await tx.sale.create({
					data: {
						store_id,
						total,
						created_by: id,
						discount: data.total_discount,
						customer_id: data.customer_id,
						subtotal,
						payment_method: data.payment_method,
					},
				});

				const saleItem = await tx.saleItem.create({
					data: {
						sale_id: sale.id,
						product_id: data.product_id,
						quantity: data.quantity,
						unit_price: new Decimal(product!.price),
						discount: data.product_discount,
						subtotal,
					},
				});

                const inventory = await tx.inventory.updateMany({
                    where: {
                        store_id,
                        product_id: data.product_id,
                    },
                    data: {
                        quantity: {
                            decrement: data.quantity,
                        },
                    },
                });

				return { sale, saleItem, inventory };
			});

			return response;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async getSales(filters?: SalesFilters, storeId?: string) {
		try {
			const response = await this.database.sale.findMany({
				where: {...filters, store_id: storeId},
				select: {
					id: true,
					subtotal: true,
					discount: true,
					total: true,
					payment_method: true,
                    items: {
                        select: { 
                            quantity: true,
                        }
                    },
					status: true,
					created_at: true,
					created_by: true,
					store: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
					customer: {
						select: {
							first_name: true,
							last_name: true,
						},
					},
				},
			});
			return response;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}
    async cancelSale(id: string) {
        try {
            const response = await this.database.sale.update({
                where: { id },
                data: { status: 'CANCELLED' },
            });
            return response;
        } catch (error) {
            throw new AppError({
                message: error.message,
                errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
            });
        }
    }
}
