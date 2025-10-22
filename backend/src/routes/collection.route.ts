import { CollectionController } from '@/controllers/Collection.controller';
import { CreateCollectionSchema } from '@/schemas/collection.schema';
import { CollectionService } from '@/services/Collection.service';
import { fastifyTypedInstance } from '@/types/types';
import { ApiResponse } from '@/utils/api-response.util';
import prisma from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';
import z from 'zod/v4';

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
		'/upload-banner/:collectionId',
		{
			schema: {
				description: 'Upload de imagem de banner da coleção',
				tags: ['Collection'],
				params: z.object({
					collectionId: z.uuid().meta({
						description: 'ID da coleção',
						examples: ['d8f9e9c2-3b4d-4a3b-8e9c-2b4d5a3b8e9c'],
					}),
				}),
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
}
