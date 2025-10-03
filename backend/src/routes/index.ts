import type { fastifyTypedInstance } from '../types/types';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResponseSchema } from '../schemas/api-response.schema';
import { ApiResponse } from '../utils/api-response.util';

import { authRoutes } from '@/routes/auth.routes';

export async function registerRoutes(app: fastifyTypedInstance) {
	app.register(
		async (app) => {
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

			// DemaisRotas
			// exemplo: async app.register(authRoutes);

			await app.register(authRoutes, { prefix: '/auth' });
		},
		{ prefix: '/api' },
	);
}
