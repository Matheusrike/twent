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
			// Lista de origens permitidas
			const allowedOrigins: string[] = [];
			
			// Adiciona a URL do frontend configurada
			if (config.frontendUrl) {
				allowedOrigins.push(config.frontendUrl);
			}
			
			// Em produção, aceita também variações com/sem www e protocolo
			if (config.nodeEnv === 'prod' && config.frontendUrl) {
				try {
					const url = new URL(config.frontendUrl);
					// Adiciona versão com www
					if (!url.hostname.startsWith('www.')) {
						allowedOrigins.push(`${url.protocol}//www.${url.hostname}${url.pathname === '/' ? '' : url.pathname}`);
					}
					// Adiciona versão sem www
					if (url.hostname.startsWith('www.')) {
						allowedOrigins.push(`${url.protocol}//${url.hostname.replace('www.', '')}${url.pathname === '/' ? '' : url.pathname}`);
					}
				} catch (e) {
					// Ignora erros de parsing
				}
			}
			
			// Em desenvolvimento, sempre aceita localhost
			if (config.nodeEnv !== 'prod') {
				allowedOrigins.push('http://localhost:3000');
			}

			// Se não há origem (ex: requisições do Postman, curl, etc), permite
			if (!origin) {
				return callback(null, true);
			}

			// Verifica se a origem está na lista de permitidas
			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			// Log para debug (pode remover em produção se necessário)
			console.warn(`⚠️  Origin not allowed: ${origin}. Allowed origins:`, allowedOrigins);

			return callback(new Error(`Origin not allowed: ${origin}`), false);
		},
		credentials: true,
	});

	await app.register(fastifyHelmet);

	await app.register(authorizationPlugin);

	await app.register(fastifyMultipart, {
		limits: {
			// Permite uploads de imagens de até 10MB por arquivo
			fileSize: 10 * 1024 * 1024,
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
