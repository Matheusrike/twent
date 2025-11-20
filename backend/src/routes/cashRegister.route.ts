import { CashRegisterController } from '@/controllers/CashRegister.controller';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';
import {
	CashRegisterBadRequestSchema,
	CashRegisterParamsSchema,
	CashRegisterGetResponseSchema,
	CashRegisterPatchResponseSchema,
	CashRegisterPostResponseSchema,
	CashRegisterNotFoundSchema,
	CashSessionGetResponseSchema,
	CashSessionQueryStringSchema,
	CashSessionPostResponseSchema,
	CashRegisterConflictSchema,
	CloseCashSessionResponseSchema,
} from '@/schemas/cashRegister.schema';
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
		{
			schema: {
				tags: ['CashRegister'],
				summary: 'Busca todos os caixas da loja',
				responses: {
					200: CashRegisterGetResponseSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization({ requiredRoles: ['ADMIN'] }),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await cashRegisterController.getCashRegisters(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Caixas da loja encontradas',
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
		{
			schema: {
				tags: ['CashRegister'],
				summary: 'Cria um novo caixa',
				responses: {
					201: CashRegisterPostResponseSchema,
					400: CashRegisterBadRequestSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization({ requiredRoles: ['ADMIN'] }),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await cashRegisterController.newCashRegister(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Caixa criado com sucesso',
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
		'/:id/activate',
		{
			schema: {
				tags: ['CashRegister'],
				summary: 'Ativa o caixa',
				params: CashRegisterParamsSchema,
				responses: {
					200: CashRegisterPatchResponseSchema,
					404: CashRegisterNotFoundSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization({ requiredRoles: ['ADMIN'] }),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await cashRegisterController.activateCashRegister(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'caixa ativado com sucesso',
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
		'/:id/deactivate',
		{
			schema: {
				tags: ['CashRegister'],
				summary: 'Desativa o caixa',
				params: CashRegisterParamsSchema,
				responses: {
					200: CashRegisterPatchResponseSchema,
					404: CashRegisterNotFoundSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization({ requiredRoles: ['ADMIN'] }),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await cashRegisterController.deactivateCashRegister(
						request,
					);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Caixa desativado com sucesso',
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

	app.get(
		'/sessions/open',
		{
			schema: {
				tags: ['CashRegister'],
				summary: 'Busca caixas com sessões abertas',
				responses: {
					200: CashSessionGetResponseSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization({ requiredRoles: ['ADMIN'] }),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await cashRegisterController.getOpenSessions();
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Caixas com sessões abertas encontradas',
					data: response,
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
		'/sessions/closed',
		{
			schema: {
				tags: ['CashRegister'],
				summary: 'Busca sessões fechadas de caixas',
				querystring: CashSessionQueryStringSchema,
				responses: {
					200: CashSessionGetResponseSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization({ requiredRoles: ['ADMIN'] }),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await cashRegisterController.getClosedSessions(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Sessões fechadas encontradas',
					data: response,
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

	app.post(
		'/:id/open',
		{
			schema: {
				tags: ['CashRegister'],
				summary: 'Abre uma sessão de caixa',
				params: CashRegisterParamsSchema,
				responses: {
					201: CashSessionPostResponseSchema,
					404: CashRegisterNotFoundSchema,
					409: CashRegisterConflictSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization({ requiredRoles: ['ADMIN'] }),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await cashRegisterController.openSession(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Caixa aberto com sucesso',
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
	app.delete(
		'/:id/close',
		{
			schema: {
				tags: ['CashRegister'],
				summary: 'Fecha a sessão de caixa',
				params: CashRegisterParamsSchema,
				responses: {
					200: CloseCashSessionResponseSchema,
					404: CashRegisterNotFoundSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization({ requiredRoles: ['ADMIN'] }),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await cashRegisterController.closeSession(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Caixa fechado com sucesso',
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
