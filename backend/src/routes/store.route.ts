import { FastifyReply, FastifyRequest } from 'fastify';
import { StoreService } from '@/services/Store.service';
import { StoreController } from '@/controllers/Store.controller';
import { fastifyTypedInstance } from '@/types/types';
import { ApiResponse } from '@/utils/api-response.util';
import {
	createStoreSchema,
	StoreChangeStatusResponseSchema,
	StoreConflictSchema,
	StoreGetAllResponseSchema,
	StoreGetResponseSchema,
	StoreNotFoundSchema,
	StorePostResponseSchema,
	StorePutResponseSchema,
	StoreQuerystringSchema,
	StoreUUIDSchema,
} from '@/schemas/store.schema';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';
import prisma from '@prisma/client';

export function storeRoute(app: fastifyTypedInstance) {
	const storeService = new StoreService(prisma);
	const storeController = new StoreController(storeService);

	app.get(
		'/',
		{
			schema: {
				tags: ['Store'],
				summary: 'Busca todos as lojas',
				description: 'Faz busca de todas as lojas, com ou sem filtros',
				querystring: StoreQuerystringSchema,
				response: {
					200: StoreGetAllResponseSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization(),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await storeController.get(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Lojas encontradas',
					data: response,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.get(
		'/all',
		{
			schema: {
				tags: ['Store'],
				summary: 'Busca todos as lojas sem filtros',
				description: 'Faz busca de todas as lojas sem filtros',
				response: {
					500: ApiGenericErrorSchema,
				},
			},
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await storeController.getAll(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Lojas encontradas',
					data: response,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.get(
		'/product/:sku',
		{
			schema: {
				tags: ['Store'],
				summary: 'Busca lojas por produto',
				description: 'Faz busca de lojas por produto',
			},
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response =
					await storeController.getStoreByProduct(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Lojas encontradas',
					data: response,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.get(
		'/:id',
		{
			schema: {
				tags: ['Store'],
				summary: 'Busca uma loja',
				description: 'Faz busca de uma loja',
				params: StoreUUIDSchema,
				response: {
					200: StoreGetResponseSchema,
					404: StoreNotFoundSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization(),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await storeController.get(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Loja encontrada',
					data: response,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);
	app.post(
		'/',
		{
			schema: {
				tags: ['Store'],
				summary: 'Cria uma nova loja',
				description: 'Cria uma nova loja',
				body: createStoreSchema,
				response: {
					201: StorePostResponseSchema,
					409: StoreConflictSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization(),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await storeController.create(request);

				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Loja criada com sucesso',
					data: response,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);
	app.put(
		'/:id',
		{
			schema: {
				tags: ['Store'],
				summary: 'Atualiza uma loja',
				description: 'Atualiza uma loja',
				body: createStoreSchema.partial(),
				response: {
					200: StorePutResponseSchema,
					404: StoreNotFoundSchema,
					409: StoreConflictSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization(),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await storeController.update(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Loja atualizada com sucesso',
					data: response,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);
	app.patch(
		'/:id/activate',
		{
			schema: {
				tags: ['Store'],
				summary: 'Ativa o status de uma loja',
				description: 'Altera o status de uma loja',
				response: {
					200: StoreChangeStatusResponseSchema,
					404: StoreNotFoundSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization(),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await storeController.activateStore(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Loja ativada com sucesso',
					data: response,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);
	app.patch(
		'/:id/deactivate',
		{
			schema: {
				tags: ['Store'],
				summary: 'Ativa o status de uma loja',
				description: 'Altera o status de uma loja',
				response: {
					200: StoreChangeStatusResponseSchema,
					404: StoreNotFoundSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: app.authorization(),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await storeController.deactivateStore(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Loja desativada com sucesso',
					data: response,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);
}
