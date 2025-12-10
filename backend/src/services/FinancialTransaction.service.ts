import {
	CreateFinancialTransactionType,
	UpdateFinancialTransactionType,
	IFinancialTransactionFilters,
} from '@/schemas/financial-transaction.schema';
import { IJwtAuthPayload } from '@/types/authorization.types';
import { IPaginationParams } from '@/types/pagination.types';
import { AppError } from '@/utils/errors.util';
import {
	Prisma,
	PrismaClient,
	TransactionType,
} from '@prisma/generated/client';

export class FinancialTransactionService {
	constructor(private database: PrismaClient) {}

	async create(data: CreateFinancialTransactionType, user: IJwtAuthPayload) {
		try {

			if (data.supplier_id) {
				const supplier = await this.database.supplier.findUnique({
					where: { id: data.supplier_id, is_active: true },
				});

				if (!supplier) {
					throw new AppError({
						message: 'Fornecedor não encontrado ou inativo',
						errorCode: 'SUPPLIER_NOT_FOUND',
					});
				}
			}

			const transaction = await this.database.financialTransaction.create(
				{
					data: {
						store_id: user!.storeId!,
						supplier_id: data.supplier_id || undefined,
						type: data.type as TransactionType,
						category: data.category,
						amount: new Prisma.Decimal(data.amount),
						currency: data.currency,
						description: data.description,
						reference_type: data.reference_type,
						reference_id: data.reference_id,
						transaction_date: data.transaction_date,
						created_by: user.id,
					},
					include: {
						store: {
							select: {
								id: true,
								name: true,
								code: true,
							},
						},
						supplier: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
						createdBy: {
							select: {
								id: true,
								first_name: true,
								last_name: true,
								email: true,
							},
						},
					},
				},
			);

			await this.database.auditLog.create({
				data: {
					user_id: user.id,
					action: 'CREATE',
					entity: 'FinancialTransaction',
					entity_id: transaction.id,
					new_value: transaction,
				},
			});

			return transaction;
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw error;
		}
	}

	async findAll(
		filters?: IFinancialTransactionFilters,
		pagination?: IPaginationParams,
	) {
		try {
			const page =
				pagination?.page && pagination.page > 0 ? pagination.page : 1;
			const limit =
				pagination?.limit && pagination.limit > 0
					? pagination.limit
					: 10;
			const skip = (page - 1) * limit;

			const where: Prisma.FinancialTransactionWhereInput = {};

			if (filters?.type) {
				where.type = filters.type as TransactionType;
			}

			if (filters?.category) {
				where.category = {
					contains: filters.category,
					mode: 'insensitive',
				};
			}

			if (filters?.supplier_id) {
				where.supplier_id = filters.supplier_id;
			}

			if (filters?.start_date || filters?.end_date) {
				where.transaction_date = {};
				if (filters.start_date) {
					where.transaction_date.gte = filters.start_date;
				}
				if (filters.end_date) {
					where.transaction_date.lte = filters.end_date;
				}
			}

			if (
				filters?.min_amount !== undefined ||
				filters?.max_amount !== undefined
			) {
				where.amount = {};
				if (filters.min_amount !== undefined) {
					where.amount.gte = new Prisma.Decimal(filters.min_amount);
				}
				if (filters.max_amount !== undefined) {
					where.amount.lte = new Prisma.Decimal(filters.max_amount);
				}
			}

			const [transactions, total] = await Promise.all([
				this.database.financialTransaction.findMany({
					where,
					include: {
						store: {
							select: {
								id: true,
								name: true,
								code: true,
								type: true,
							},
						},
						supplier: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
						createdBy: {
							select: {
								id: true,
								first_name: true,
								last_name: true,
								email: true,
							},
						},
					},
					orderBy: { transaction_date: 'desc' },
					skip,
					take: limit,
				}),
				this.database.financialTransaction.count({ where }),
			]);

			const totalPages = Math.ceil(total / limit);
			const hasNext = page < totalPages;
			const hasPrev = page > 1;

			return {
				transactions,
				pagination: {
					page,
					limit,
					total,
					totalPages,
					hasNext,
					hasPrev,
				},
			};
		} catch (error) {
			throw new AppError({
				message: error.message,
				errorCode: error.errorCode || 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async findById(id: string, user: IJwtAuthPayload) {
		const where: Prisma.FinancialTransactionWhereUniqueInput = { id };

		const transaction = await this.database.financialTransaction.findUnique(
			{
				where,
				include: {
					store: {
						select: {
							id: true,
							name: true,
							code: true,
							type: true,
						},
					},
					supplier: {
						select: {
							id: true,
							name: true,
							email: true,
							phone: true,
						},
					},
					createdBy: {
						select: {
							id: true,
							first_name: true,
							last_name: true,
							email: true,
						},
					},
				},
			},
		);

		if (!transaction) {
			throw new AppError({
				message: 'Transação financeira não encontrada',
				errorCode: 'TRANSACTION_NOT_FOUND',
			});
		}

		if (user.storeId && user.storeId !== transaction.store_id) {
			throw new AppError({
				message:
					'Você não tem permissão para visualizar esta transação',
				errorCode: 'TRANSACTION_ACCESS_DENIED',
			});
		}

		return transaction;
	}

	async update(
		id: string,
		data: UpdateFinancialTransactionType,
		user: IJwtAuthPayload,
	) {
		try {
			const existingTransaction =
				await this.database.financialTransaction.findUnique({
					where: { id },
				});

			if (!existingTransaction) {
				throw new AppError({
					message: 'Transação financeira não encontrada',
					errorCode: 'TRANSACTION_NOT_FOUND',
				});
			}

			if (user.storeId && user.storeId !== existingTransaction.store_id) {
				throw new AppError({
					message:
						'Você não tem permissão para atualizar esta transação',
					errorCode: 'TRANSACTION_ACCESS_DENIED',
				});
			}

			if (data.supplier_id) {
				const supplier = await this.database.supplier.findUnique({
					where: { id: data.supplier_id, is_active: true },
				});

				if (!supplier) {
					throw new AppError({
						message: 'Fornecedor não encontrado ou inativo',
						errorCode: 'SUPPLIER_NOT_FOUND',
					});
				}
			}

			const updatedTransaction =
				await this.database.financialTransaction.update({
					where: { id },
					data: {
						supplier_id: data.supplier_id,
						type: data.type as TransactionType | undefined,
						category: data.category,
						amount: data.amount
							? new Prisma.Decimal(data.amount)
							: undefined,
						currency: data.currency,
						description: data.description,
						reference_type: data.reference_type,
						reference_id: data.reference_id,
						transaction_date: data.transaction_date,
					},
					include: {
						store: {
							select: {
								id: true,
								name: true,
								code: true,
							},
						},
						supplier: {
							select: {
								id: true,
								name: true,
								email: true,
							},
						},
						createdBy: {
							select: {
								id: true,
								first_name: true,
								last_name: true,
								email: true,
							},
						},
					},
				});

			await this.database.auditLog.create({
				data: {
					user_id: user.id,
					action: 'UPDATE',
					entity: 'FinancialTransaction',
					entity_id: id,
					old_value: existingTransaction,
					new_value: updatedTransaction,
				},
			});

			return updatedTransaction;
		} catch (error) {
			if (error instanceof AppError) throw error;
			throw error;
		}
	}

	async delete(id: string, user: IJwtAuthPayload) {
		const transaction = await this.database.financialTransaction.findUnique(
			{
				where: { id },
			},
		);

		if (!transaction) {
			throw new AppError({
				message: 'Transação financeira não encontrada',
				errorCode: 'TRANSACTION_NOT_FOUND',
			});
		}

		if (user.storeId && user.storeId !== transaction.store_id) {
			throw new AppError({
				message: 'Você não tem permissão para remover esta transação',
				errorCode: 'TRANSACTION_ACCESS_DENIED',
			});
		}

		const oldData = { ...transaction };

		await this.database.financialTransaction.delete({
			where: { id },
		});

		await this.database.auditLog.create({
			data: {
				user_id: user.id,
				action: 'DELETE',
				entity: 'FinancialTransaction',
				entity_id: id,
				old_value: oldData,
			},
		});
	}

	async getCashFlowReport(
		user: IJwtAuthPayload,
		startDate?: Date,
		endDate?: Date,
		storeId?: string,
	) {
		const where: Prisma.FinancialTransactionWhereInput = {};

		if (user.storeId) {
			where.store_id = user.storeId;
		} else if (storeId) {
			where.store_id = storeId;
		}

		if (startDate || endDate) {
			where.transaction_date = {};
			if (startDate) {
				where.transaction_date.gte = startDate;
			}
			if (endDate) {
				where.transaction_date.lte = endDate;
			}
		}

		const transactions = await this.database.financialTransaction.findMany({
			where,
			orderBy: { transaction_date: 'asc' },
			include: {
				store: {
					select: {
						id: true,
						name: true,
						code: true,
					},
				},
			},
		});

		let balance = 0;
		const cashFlow = transactions.map((transaction) => {
			const amount = transaction.amount.toNumber();
			const value = transaction.type === 'INCOME' ? amount : -amount;
			balance += value;

			return {
				id: transaction.id,
				date: transaction.transaction_date,
				type: transaction.type,
				category: transaction.category,
				description: transaction.description,
				amount: amount,
				value: value,
				balance: balance,
				store: transaction.store,
			};
		});

		const totalIncome = transactions
			.filter((t) => t.type === 'INCOME')
			.reduce((sum, t) => sum + t.amount.toNumber(), 0);

		const totalExpense = transactions
			.filter((t) => t.type === 'EXPENSE')
			.reduce((sum, t) => sum + t.amount.toNumber(), 0);

		return {
			cashFlow,
			summary: {
				totalIncome,
				totalExpense,
				balance: totalIncome - totalExpense,
				period: {
					startDate,
					endDate,
				},
			},
		};
	}

	async getFinancialSummary(
		user: IJwtAuthPayload,
		startDate?: Date,
		endDate?: Date,
		storeId?: string,
	) {
		const where: Prisma.FinancialTransactionWhereInput = {};

		if (user.storeId) {
			where.store_id = user.storeId;
		} else if (storeId) {
			where.store_id = storeId;
		}

		if (startDate || endDate) {
			where.transaction_date = {};
			if (startDate) {
				where.transaction_date.gte = startDate;
			}
			if (endDate) {
				where.transaction_date.lte = endDate;
			}
		}

		const [totalIncome, totalExpense, transactionCount] = await Promise.all(
			[
				this.database.financialTransaction.aggregate({
					where: { ...where, type: 'INCOME' },
					_sum: { amount: true },
				}),
				this.database.financialTransaction.aggregate({
					where: { ...where, type: 'EXPENSE' },
					_sum: { amount: true },
				}),
				this.database.financialTransaction.count({ where }),
			],
		);

		const income = totalIncome._sum.amount?.toNumber() || 0;
		const expense = totalExpense._sum.amount?.toNumber() || 0;

		return {
			totalIncome: income,
			totalExpense: expense,
			balance: income - expense,
			transactionCount,
			period: {
				startDate,
				endDate,
			},
		};
	}

	async getTransactionsByCategory(
		user: IJwtAuthPayload,
		startDate?: Date,
		endDate?: Date,
		storeId?: string,
	) {
		const where: Prisma.FinancialTransactionWhereInput = {};

		if (user.storeId) {
			where.store_id = user.storeId;
		} else if (storeId) {
			where.store_id = storeId;
		}

		if (startDate || endDate) {
			where.transaction_date = {};
			if (startDate) {
				where.transaction_date.gte = startDate;
			}
			if (endDate) {
				where.transaction_date.lte = endDate;
			}
		}

		const transactions = await this.database.financialTransaction.findMany({
			where,
			select: {
				type: true,
				category: true,
				amount: true,
			},
		});

		const categoryMap = new Map<
			string,
			{ income: number; expense: number; count: number }
		>();

		transactions.forEach((transaction) => {
			const category = transaction.category;
			const amount = transaction.amount.toNumber();

			if (!categoryMap.has(category)) {
				categoryMap.set(category, { income: 0, expense: 0, count: 0 });
			}

			const categoryData = categoryMap.get(category)!;
			categoryData.count += 1;

			if (transaction.type === 'INCOME') {
				categoryData.income += amount;
			} else {
				categoryData.expense += amount;
			}
		});

		const byCategory = Array.from(categoryMap.entries()).map(
			([category, data]) => ({
				category,
				income: data.income,
				expense: data.expense,
				balance: data.income - data.expense,
				count: data.count,
			}),
		);

		return byCategory.sort(
			(a, b) => Math.abs(b.balance) - Math.abs(a.balance),
		);
	}
}
