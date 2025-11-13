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

	async getOpenSessions() {
		try {
			const response = await this.database.cashSession.findMany({
				where: { status: 'OPEN' },
				select: {
					id: true,
					cashRegister: {
						select: {
							name: true,
						},
					},
					user: {
						select: {
							first_name: true,
							last_name: true,
						},
					},
					opening_amount: true,
					opened_at: true,
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

	async getClosedSessions(cash_register_id?: string, user_id?: string) {
		try {
			const response = await this.database.cashSession.findMany({
				where: { cash_register_id, status: 'CLOSED', user_id },
				select: {
					id: true,
					cashRegister: {
						select: {
							name: true,
						},
					},
					user: {
						select: {
							first_name: true,
							last_name: true,
						},
					},
					opening_amount: true,
                    closing_amount: true,
					opened_at: true,
                    closed_at: true,
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

	async openSession(cash_register_id: string, user_id: string) {
		try {
			const alreadyOpenSession =
				await this.database.cashSession.findFirst({
					where: { cash_register_id, status: 'OPEN' },
				});
			if (alreadyOpenSession) {
				throw new AppError({
					message: 'Sessão ja aberta',
					errorCode: 'CONFLICT',
				});
			}
			const pastCashSession = await this.database.cashSession.findFirst({
				where: { cash_register_id, status: 'CLOSED' },
				orderBy: { opened_at: 'desc' },
			});
			const response = await this.database.cashSession.create({
				data: {
					user_id,
					cash_register_id,
					opening_amount:
						(pastCashSession?.closing_amount as Decimal) || 0,
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

	async closeSession(sessionId: string, reportedClosingAmount: number) {
		try {
			const session = await this.database.cashSession.findUnique({
				where: { id: sessionId },
				include: { sales: { where: { status: 'COMPLETED' } } },
			});

			if (!session) {
				throw new AppError({
					message: 'Sessão nao encontrada',
					errorCode: 'NOT_FOUND',
				});
			}
			if (session.status !== 'OPEN') {
				throw new AppError({
					message: 'Sessão nao aberta',
					errorCode: 'NOT_FOUND',
				});
			}

			const totalCashSales = session.sales.reduce(
				(acc, sale) => acc + Number(sale.total),
				0,
			);

			const expectedClosing =
				Number(session.opening_amount) + totalCashSales;
			const difference = reportedClosingAmount - expectedClosing;

			const closedSession = await this.database.cashSession.update({
				where: { id: sessionId },
				data: {
					closing_amount: reportedClosingAmount,
					closed_at: new Date(),
					status: 'CLOSED',
				},
			});

			return {
				...closedSession,
				totalCashSales,
				expectedClosing,
				difference,
			};
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}
}
