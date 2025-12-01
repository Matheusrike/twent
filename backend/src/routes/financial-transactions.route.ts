import { fastifyTypedInstance } from '@/types/types';
import { FinancialTransactionController } from '@/controllers/FinancialTransaction.controller';
import { FinancialTransactionService } from '@/services/FinancialTransaction.service';
import {
	createFinancialTransactionSchema,
	updateFinancialTransactionSchema,
} from '@/schemas/financial-transaction.schema';
import prisma from '@prisma/client';
import { ApiResponse } from '@/utils/api-response.util';
import { HttpError } from '@/utils/errors.util';

export async function financialTransactionRoutes(app: fastifyTypedInstance) {
	const financialTransactionService = new FinancialTransactionService(prisma);
	const financialTransactionController = new FinancialTransactionController(
		financialTransactionService,
	);

	app.post(
		'/',
		{
			schema: {
                tags: ['Financial Transaction'],
                summary: 'Cria uma nova transação financeira',
				body: createFinancialTransactionSchema,
			},
			preHandler: [
				app.authorization({ requiredRoles: ['ADMIN', 'MANAGER'] }),
			],
		},
		async (request, reply) => {
			try {
				const newTransaction =
					await financialTransactionController.create(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Transação financeira criada com sucesso',
					data: newTransaction,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.get(
		'/',
		{
            schema: {
                tags: ['Financial Transaction'],
                summary: 'Busca todas as transações financeiras',
            },
			preHandler: [
				app.authorization({
					requiredRoles: ['ADMIN', 'MANAGER'],
				}),
			],
		},
		async (request, reply) => {
			try {
				const transactions =
					await financialTransactionController.findAll(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Transações financeiras recuperadas com sucesso',
					data: transactions,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.get(
		'/:id',
		{   
            schema: {
                tags: ['Financial Transaction'],
                summary: 'Busca uma transação financeira',
            },
			preHandler: [
				app.authorization({
					requiredRoles: ['ADMIN', 'MANAGER'],
				}),
			],
		},
		async (request, reply) => {
			try {
				const transaction =
					await financialTransactionController.findById(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Transação financeira recuperada com sucesso',
					data: transaction,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.put(
		'/:id',
		{
			schema: {
                tags: ['Financial Transaction'],
                summary: 'Atualiza uma transação financeira',
				body: updateFinancialTransactionSchema,
			},
			preHandler: [
				app.authorization({ requiredRoles: ['ADMIN', 'MANAGER'] }),
			],
		},
		async (request, reply) => {
			try {
				const updatedTransaction =
					await financialTransactionController.update(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Transação financeira atualizada com sucesso',
					data: updatedTransaction,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.delete(
		'/:id',
		{
            schema: {
                tags: ['Financial Transaction'],
                summary: 'Remove uma transação financeira',
            },
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request, reply) => {
			try {
				await financialTransactionController.delete(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Transação financeira removida com sucesso',
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.get(
		'/reports/cash-flow',
		{
            schema: {
                tags: ['Financial Transaction'],
                summary: 'Busca o relatório de fluxo de caixa',
            },
			preHandler: [
				app.authorization({
					requiredRoles: ['ADMIN', 'MANAGER'],
				}),
			],
		},
		async (request, reply) => {
			try {
				const cashFlow =
					await financialTransactionController.getCashFlowReport(
						request,
					);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message:
						'Relatório de fluxo de caixa recuperado com sucesso',
					data: cashFlow,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.get(
		'/reports/summary',
		{
            schema: {
                tags: ['Financial Transaction'],
                summary: 'Busca o resumo financeiro',
            },
			preHandler: [
				app.authorization({
					requiredRoles: ['ADMIN', 'MANAGER'],
				}),
			],
		},
		async (request, reply) => {
			try {
				const summary =
					await financialTransactionController.getFinancialSummary(
						request,
					);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Resumo financeiro recuperado com sucesso',
					data: summary,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.get(
		'/reports/by-category',
		{
            schema: {
                tags: ['Financial Transaction'],
                summary: 'Busca as transações por categoria',
            },
			preHandler: [
				app.authorization({
					requiredRoles: ['ADMIN', 'MANAGER'],
				}),
			],
		},
		async (request, reply) => {
			try {
				const byCategory =
					await financialTransactionController.getTransactionsByCategory(
						request,
					);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Transações por categoria recuperadas com sucesso',
					data: byCategory,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);
}
