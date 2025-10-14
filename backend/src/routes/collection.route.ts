import { CollectionController } from '@/controllers/Collection.controller';
import { CreateCollectionSchema } from '@/schemas/collection.schema';
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
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const collection = await collectionController.create(
					request,
					reply,
				);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Coleção criada com sucesso',
					data: collection,
				});
			} catch (error) {
				return new ApiResponse({
					statusCode: error.statusCode,
					success: false,
					message: error.message,
					errorCode: error.errorCode,
				});
			}
		},
	);
}
