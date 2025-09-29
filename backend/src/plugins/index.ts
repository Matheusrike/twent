import type { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

import authorizationPlugin from './authorization.plugin.ts';
import type { IAppConfig } from '../types/types.ts';

export async function registerPlugins(
	app: FastifyInstance,
	config: IAppConfig,
) {
	// Plugins principais
	await app.register(cookie, {
		secret: config.cookieSecret,
	});

	await app.register(jwt, {
		secret: config.jwtSecret,
	});

	await app.register(authorizationPlugin);

	// Plugins de documentação (apenas em ambiente de desenvolvimento)
	if (config.nodeEnv !== 'production') {
		await app.register(fastifySwagger, {
			openapi: {
				info: {
					title: 'Twent API',
					version: '1.0.0',
					description: 'Twent API documentation',
				},
				servers: [
					{
						url: `http://localhost:${config.port}`,
						description: 'Development server',
					},
				],
			},
			transform: jsonSchemaTransform,
		});

		await app.register(fastifySwaggerUi, {
			routePrefix: '/docs',
			uiConfig: {
				docExpansion: 'list',
				deepLinking: false,
			},
		});
	}
}
