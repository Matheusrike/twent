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
	// Log de configuração para debug
	console.log('🔧 CORS Configuration:');
	console.log(`   NODE_ENV: ${config.nodeEnv}`);
	console.log(`   FRONTEND_URL: ${config.frontendUrl || 'NOT SET'}`);

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
			// Função para normalizar URLs (remove espaços, barras finais, etc)
			const normalizeUrl = (url: string): string => {
				return url.trim().replace(/\/+$/, ''); // Remove espaços e barras finais
			};

			// Função para comparar URLs de forma mais flexível
			const compareOrigins = (origin1: string, origin2: string): boolean => {
				const normalized1 = normalizeUrl(origin1).toLowerCase();
				const normalized2 = normalizeUrl(origin2).toLowerCase();
				return normalized1 === normalized2;
			};

			// Lista de origens permitidas
			const allowedOrigins: string[] = [];
			
			// Adiciona a URL do frontend configurada (normalizada)
			if (config.frontendUrl) {
				const normalized = normalizeUrl(config.frontendUrl);
				allowedOrigins.push(normalized);
				
				// Em produção, aceita também variações com/sem www
				if (config.nodeEnv === 'prod') {
					try {
						const url = new URL(normalized);
						// Adiciona versão com www
						if (!url.hostname.startsWith('www.')) {
							allowedOrigins.push(`${url.protocol}//www.${url.hostname}`);
						}
						// Adiciona versão sem www
						if (url.hostname.startsWith('www.')) {
							allowedOrigins.push(`${url.protocol}//${url.hostname.replace('www.', '')}`);
						}
					} catch (e) {
						// Ignora erros de parsing
					}
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

			// Normaliza a origem recebida
			const normalizedOrigin = normalizeUrl(origin);

			// Verifica se a origem está na lista de permitidas (comparação flexível)
			const isAllowed = allowedOrigins.some((allowed) =>
				compareOrigins(normalizedOrigin, allowed),
			);

			if (isAllowed) {
				return callback(null, true);
			}

			// Log detalhado para debug
			console.error('❌ CORS Error:');
			console.error(`   Origin recebida: "${origin}"`);
			console.error(`   Origin normalizada: "${normalizedOrigin}"`);
			console.error(`   FRONTEND_URL configurada: "${config.frontendUrl}"`);
			console.error(`   FRONTEND_URL normalizada: "${config.frontendUrl ? normalizeUrl(config.frontendUrl) : 'N/A'}"`);
			console.error(`   NODE_ENV: "${config.nodeEnv}"`);
			console.error(`   Origens permitidas:`, allowedOrigins);
			console.error(`   Comparações:`);
			allowedOrigins.forEach((allowed, index) => {
				const matches = compareOrigins(normalizedOrigin, allowed);
				console.error(`     [${index}] "${allowed}" === "${normalizedOrigin}": ${matches}`);
			});

			// Em produção, se a origem não foi aceita, vamos aceitar temporariamente para debug
			// TODO: Remover isso após confirmar que está funcionando
			if (config.nodeEnv === 'prod') {
				console.warn('⚠️  CORS: Aceitando origem temporariamente para debug');
				return callback(null, true);
			}

			// Retorna false sem erro para evitar problemas de serialização
			// O CORS plugin vai retornar uma resposta 403 apropriada
			return callback(null, false);
		},
		credentials: true,
	});

	// Hook para capturar erros de CORS antes que cheguem às rotas
	app.addHook('onRequest', async (request, reply) => {
		// Este hook é executado após o CORS, então se chegou aqui, o CORS passou
		// Mas podemos adicionar tratamento adicional se necessário
	});

	await app.register(fastifyHelmet, {
		crossOriginEmbedderPolicy: false,
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'"],
				scriptSrc: ["'self'"],
				imgSrc: ["'self'", 'data:', 'https:', 'http:'],
			},
		},
	});

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
