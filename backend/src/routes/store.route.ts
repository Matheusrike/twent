import { FastifyReply, FastifyRequest } from 'fastify';
import { StoreService } from '@/services/Store.service';
import { StoreController } from '@/controllers/Store.controller';
import { fastifyTypedInstance } from '@/types/types';
import { ApiResponse } from '@/utils/api-response.util';
import {
	StoreBadRequestSchema,
	StoreChangeStatusResponseSchema,
	StoreConflictSchema,
	StoreGetResponseSchema,
	StoreNotFoundSchema,
	StorePostResponseSchema,
	StorePutResponseSchema,
	StoreQuerystringSchema,
} from '@/schemas/store.schema';
import { ApiGenericErrorSchema } from '@/schemas/api-response.schema';

export function storeRoute(fastify: fastifyTypedInstance) {
	const storeService = new StoreService();
	const storeController = new StoreController(storeService);

	fastify.get(
		'/',
		{
			schema: {
				tags: ['Store'],
				summary: 'Busca todos as lojas',
				description: 'Faz busca de todas as lojas, com ou sem filtros',
				querystring: StoreQuerystringSchema,
				response: {
					200: StoreGetResponseSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: fastify.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ', 'MANAGER_BRANCH'],
			}),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await storeController.get(request, reply);
				return response;
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
	fastify.post(
		'/',
		{
			schema: {
				tags: ['Store'],
				summary: 'Cria uma nova loja',
				description: 'Cria uma nova loja',
				response: {
					201: StorePostResponseSchema,
					400: StoreBadRequestSchema,
					409: StoreConflictSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: fastify.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ'],
			}),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await storeController.create(request, reply);
				return response;
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
	fastify.put<{ Params: { id: string } }>(
		'/:id',
		{
			schema: {
				tags: ['Store'],
				summary: 'Atualiza uma loja',
				description: 'Atualiza uma loja',
				response: {
					200: StorePutResponseSchema,
					400: StoreBadRequestSchema,
					404: StoreNotFoundSchema,
					409: StoreConflictSchema,
					500: ApiGenericErrorSchema,
				},
			},
			preHandler: fastify.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ'],
			}),
		},
		async (
			request: FastifyRequest<{ Params: { id: string } }>,
			reply: FastifyReply,
		) => {
			try {
				const response = await storeController.update(request, reply);
				return response;
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
	fastify.patch<{ Params: { id: string }; Body: { newStatus: boolean } }>(
		'/:id',
        {
            schema: {
                tags: ['Store'],
                summary: 'Atualiza o status de uma loja',
                description: 'Atualiza o status de uma loja',
                response: {
                    200: StoreChangeStatusResponseSchema,
                    400: StoreBadRequestSchema,
                    404: StoreNotFoundSchema,
                    500: ApiGenericErrorSchema,
                },
            },
            preHandler: fastify.authorization({
                requiredRoles: ['ADMIN', 'MANAGER_HQ'],
            })
        },
		async (
			request: FastifyRequest<{
				Params: { id: string };
				Body: { newStatus: boolean };
			}>,
			reply: FastifyReply,
		) => {
			try {
				const response = await storeController.changeStatus(
					request,
					reply,
				);
				return response;
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
