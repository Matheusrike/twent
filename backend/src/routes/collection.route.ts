import { CollectionController } from '@/controllers/Collection.controller';
import {
	CreateCollectionSchema,
	UpdateCollectionSchema,
	UploadCollectionImageBodySchema,
	CollectionParamsSchema,
	CollectionQuerySchema,
} from '@/schemas/collection.schema';
import { CollectionService } from '@/services/Collection.service';
import { fastifyTypedInstance } from '@/types/types';
import { ApiResponse } from '@/utils/api-response.util';
import prisma from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function collectionRoutes(app: fastifyTypedInstance) {
	const collectionService = new CollectionService(prisma);
	const collectionController = new CollectionController(collectionService);

	app.post(
		'/',
		{
			schema: {
				description: 'Criação de coleção',
				tags: ['Collection'],
				body: CreateCollectionSchema,
			},
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const collection = await collectionController.create(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Coleção criada com sucesso',
					data: collection,
				}).send(reply);
			} catch (error) {
				console.log(error);
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.patch(
		'/:id/upload-banner',
		{
			schema: {
				description: 'Upload de imagem de banner da coleção',
				tags: ['Collection'],
				params: CollectionParamsSchema,
				body: UploadCollectionImageBodySchema,
			},
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const uploadedCollection =
					await collectionController.uploadBanner(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Banner da coleção atualizado com sucesso',
					data: uploadedCollection,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.get(
		'/actives',
		{
			schema: {
				description: 'Buscar coleções ativas com paginação',
				tags: ['Collection'],
				querystring: CollectionQuerySchema,
			},
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const collections =
					await collectionController.findActive(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Coleções ativas encontradas com sucesso',
					data: collections,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
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
				description: 'Buscar coleção por ID',
				tags: ['Collection'],
				params: CollectionParamsSchema,
			},
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const collection = await collectionController.findById(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Coleção encontrada com sucesso',
					data: collection,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.get(
		'/',
		{
			schema: {
				description: 'Buscar todas as coleções com filtros e paginação',
				tags: ['Collection'],
				querystring: CollectionQuerySchema,
			},
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const collections = await collectionController.findAll(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Coleções encontradas com sucesso',
					data: collections,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
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
				description: 'Atualizar coleção',
				tags: ['Collection'],
				params: CollectionParamsSchema,
				body: UpdateCollectionSchema,
			},
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const collection = await collectionController.update(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Coleção atualizada com sucesso',
					data: collection,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
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
				description: 'Desativar coleção',
				tags: ['Collection'],
				params: CollectionParamsSchema,
			},
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const collection =
					await collectionController.deactivate(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Coleção desativada com sucesso',
					data: collection,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
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
				description: 'Ativar coleção',
				tags: ['Collection'],
				params: CollectionParamsSchema,
			},
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const collection = await collectionController.activate(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Coleção ativada com sucesso',
					data: collection,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.delete(
		'/:id',
		{
			schema: {
				description: 'Deletar coleção',
				tags: ['Collection'],
				params: CollectionParamsSchema,
			},
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const result = await collectionController.delete(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Coleção deletada com sucesso',
					data: result,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.get(
		'/:id/stats',
		{
			schema: {
				description: 'Buscar estatísticas da coleção',
				tags: ['Collection'],
				params: CollectionParamsSchema,
			},
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const stats = await collectionController.getStats(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Estatísticas da coleção obtidas com sucesso',
					data: stats,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);
}
