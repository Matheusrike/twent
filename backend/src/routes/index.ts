import type { fastifyTypedInstance } from '../types/types';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResponseSchema } from '../schemas/api-response.schema';
import { ApiResponse } from '../utils/api-response.util';

import { authRoutes } from '@/routes/auth.routes';
import { customerRoute } from './customer.route.ts';
import { employeeRoute } from './employee.route.ts';
import { userRoute } from './user.route.ts';
import { storeRoute } from './store.route.ts';
import { collectionRoutes } from './collection.route.ts';

export async function registerRoutes(app: fastifyTypedInstance) {
	app.register(
		async (app: fastifyTypedInstance) => {
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

			await app.register(authRoutes, { prefix: '/auth' });
			await app.register(customerRoute, { prefix: '/customer' });
			await app.register(employeeRoute, { prefix: '/employee' });
			await app.register(userRoute, { prefix: '/user' });
			await app.register(storeRoute, { prefix: '/store' });
			await app.register(collectionRoutes, { prefix: '/collection' });
		},
		{ prefix: '/api' },
	);
}
