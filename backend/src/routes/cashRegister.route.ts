import { CashRegisterController } from '@/controllers/CashRegister.controller';
import { CashRegisterService } from '@/services/CashRegister.service';
import { fastifyTypedInstance } from '@/types/types';
import { ApiResponse } from '@/utils/api-response.util';
import { HttpError } from '@/utils/errors.util';
import prisma from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function cashRegisterRoutes(app: fastifyTypedInstance) {
	const cashRegisterService = new CashRegisterService(prisma);
	const cashRegisterController = new CashRegisterController(
		cashRegisterService,
	);
	app.get(
		'/',
		{ preHandler: app.authorization({ requiredRoles: ['ADMIN'] }) },
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await cashRegisterController.getCashRegisters(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Informações das filiais encontradas',
					data: response,
				});
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

	app.post(
		'/',
		{ preHandler: app.authorization({ requiredRoles: ['ADMIN'] }) },
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await cashRegisterController.newCashRegister(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'caixa criado com sucesso',
					data: response,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
					}).send(reply);
				}
			}
		},
	);

	app.patch(
		'/activate/:id',
		{},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await cashRegisterController.activateCashRegister(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'caixa ativada com sucesso',
					data: response,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
					}).send(reply);
				}
			}
		},
	);
	app.patch(
		'/deactivate/:id',
		{},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await cashRegisterController.deactivateCashRegister(
						request,
					);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Caixa desativada com sucesso',
					data: response,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
					}).send(reply);
				}
			}
		},
	);
}
