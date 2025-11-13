import { AppError } from '@/utils/errors.util';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaClient } from '@prisma/generated/client';

export class CashRegisterService {
	constructor(private database: PrismaClient) {}

	async getCashRegisters(storeId: string) {
		try {
			const response = await this.database.cashRegister.findMany({
				where: { store_id: storeId },
			});
			return response;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async newCashRegister(store_id: string) {
		try {
			const existingCashRegister =
				await this.database.cashRegister.findMany({
					where: { store_id },
				});

			const response = await this.database.cashRegister.create({
				data: {
					store_id,
					name: `CR_${existingCashRegister.length + 1}`,
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

	async activateCashRegister(id: string) {
		try {
			const response = await this.database.cashRegister.update({
				where: { id },
				data: { is_active: true },
			});
			return response;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}
	async deactivateCashRegister(id: string) {
		try {
			const response = await this.database.cashRegister.update({
				where: { id },
				data: { is_active: false },
			});
			return response;
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async openCashSession(cash_register_id: string, user_id: string) {
		try {
			const pastCashSession = await this.database.cashSession.findFirst({
				where: { cash_register_id, status: 'CLOSED' },
				orderBy: { opened_at: 'desc' },
			});
			const response = await this.database.cashSession.create({
				data: {
					user_id,
					cash_register_id,
					opening_amount: pastCashSession?.closing_amount as Decimal,
					status: 'OPEN',
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

    //TODO: implementar o fechamento de sessão
	async closeSession(sessionId: string, reportedClosingAmount: number) {
		const session = await prisma.cashSession.findUnique({
			where: { id: sessionId },
			include: { sales: { where: { status: 'COMPLETED' } } },
		});

		if (!session) throw new Error('Sessão não encontrada.');
		if (session.status !== 'OPEN')
			throw new Error('Sessão já está fechada.');

		const totalCashSales = session.sales
			.filter((s) => s.payment_method === 'CASH')
			.reduce((acc, sale) => acc + Number(sale.total), 0);

		const expectedClosing = Number(session.opening_amount) + totalCashSales;
		const difference = reportedClosingAmount - expectedClosing;

		const closedSession = await prisma.cashSession.update({
			where: { id: sessionId },
			data: {
				closing_amount: reportedClosingAmount,
				closed_at: new Date(),
				status: 'CLOSED',
				// difference: difference // opcional
			},
		});

		return {
			...closedSession,
			totalCashSales,
			expectedClosing,
			difference,
		};
	}
}
