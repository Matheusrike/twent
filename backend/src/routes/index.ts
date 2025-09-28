import type { fastifyTypedInstance } from '../types/types.ts';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResponseSchema } from '../schemas/api-response.schema.ts';
import { ApiResponse } from '../utils/api-response.util.ts';

export async function registerRoutes(app: fastifyTypedInstance) {
	app.get(
		'/health',
		{
			schema: {
				description: 'Health check endpoint',
				tags: ['Health'],
				response: {
					200: ApiResponseSchema,
				},
			},
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			return new ApiResponse({
				message: 'OK',
				success: true,
				statusCode: 200,
			}).send(reply);
		},
	);

	// Rotas
	// exemplo: app.register(authRoutes);
}
