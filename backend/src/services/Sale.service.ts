import { NewSale, SalesFilters } from '@/schemas/sale.schema';
import { AppError } from '@/utils/errors.util';
import { PrismaClient } from '@prisma/generated/client';

export class SaleService {
	constructor(private database: PrismaClient) {}

	async newSale(data: NewSale, store_id: string, id: string) {
		try {
			const sessionIsOpen = await this.database.cashSession.findUnique({
				where: {
					id: data.cash_session_id,
				},
			});
			if (!sessionIsOpen) {
				throw new AppError({
					message: 'Sessao de caixa nao encontrada',
					errorCode: 'NOT_FOUND',
				});
			}
			if (sessionIsOpen.status !== 'OPEN') {
				throw new AppError({
					message: 'Sessao de caixa nao aberta',
					errorCode: 'BAD_REQUEST',
				});
			}
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
			const subtotal =
				Number(data.quantity) * Number(data.unit_price) -
				Number(data.product_discount);
			const total = Number(subtotal) - Number(data.total_discount);
			const response = await this.database.$transaction(async (tx) => {
				const sale = await tx.sale.create({
					data: {
						store_id,
						total,
						created_by: id,
						discount: data.total_discount,
						cash_session_id: data.cash_session_id,
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
						unit_price: data.unit_price,
						discount: data.product_discount,
						subtotal,
					},
				});

				return { sale, saleItem };
			});

			return response;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async getSales(filters?: SalesFilters) {
		try {
			const response = await this.database.sale.findMany({
				where: filters,
				select: {
					id: true,
					cash_session_id: true,
					subtotal: true,
					discount: true,
					total: true,
					payment_method: true,
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
}
