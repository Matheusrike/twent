import type { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import fastifyMultipart from '@fastify/multipart';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastifyHelmet } from '@fastify/helmet';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';
import authorizationPlugin from './authorization.plugin';
import type { IAppConfig } from '@/types/types';
import fastifyCors from '@fastify/cors';

export async function registerPlugins(
	app: FastifyInstance,
	config: IAppConfig,
) {
	// Plugins principais
	await app.register(cookie, {
		secret: config.cookieSecret,
		hook: 'onRequest',
	});

	await app.register(jwt, {
		secret: config.jwtSecret,
	});

	await app.register(fastifyCors, {
		origin: (origin, callback) => {
			const allowedOrigins = [config.frontendUrl].filter(Boolean);

			if (!origin) {
				return callback(null, true);
			}

			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error(`Origin not allowed: ${origin}`), false);
		},
		credentials: true,
	});

	await app.register(fastifyHelmet);

	await app.register(authorizationPlugin);

	await app.register(fastifyMultipart, {
		limits: {
			fileSize: 20 * 1024 * 1024,
			files: 10,
		},
		attachFieldsToBody: true,
	});

	// Plugins de documentação (apenas em ambiente de desenvolvimento)
	if (config.nodeEnv !== 'prod') {
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
