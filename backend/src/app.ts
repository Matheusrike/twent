import Fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
	validatorCompiler,
	serializerCompiler,
} from 'fastify-type-provider-zod';

import { registerPlugins } from './plugins/index';
import { registerRoutes } from './routes/index';
import type { IAppConfig } from './types/types';

export async function createApp(config: IAppConfig) {
	const app = Fastify({
		// Desabilita a validação de schema para respostas de erro
		disableRequestLogging: false,
	}).withTypeProvider<ZodTypeProvider>();

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	// Hook para capturar erros antes da serialização
	app.addHook('onError', async (request, reply, error) => {
		// Trata erros de CORS antes que cheguem ao handler de rotas
		if (error.message && error.message.includes('Origin not allowed')) {
			// Bypassa a validação de schema para erros de CORS
			reply.status(403);
			reply.type('application/json');
			return reply.send({
				success: false,
				statusCode: 403,
				message: error.message,
				errorCode: 'CORS_ERROR',
			});
		}
	});

	// Handler global de erros para tratar erros de serialização
	app.setErrorHandler((error, request, reply) => {
		// Trata erros de CORS
		if (error.message && error.message.includes('Origin not allowed')) {
			// Bypassa a validação de schema
			reply.status(403);
			reply.type('application/json');
			return reply.send({
				success: false,
				statusCode: 403,
				message: error.message,
				errorCode: 'CORS_ERROR',
			});
		}

		// Trata outros erros
		console.error('❌ Unhandled error:', error);
		reply.status(error.statusCode || 500);
		reply.type('application/json');
		return reply.send({
			success: false,
			statusCode: error.statusCode || 500,
			message: error.message || 'Erro interno do servidor',
			errorCode: 'INTERNAL_SERVER_ERROR',
		});
	});

	await registerPlugins(app, config);
	await registerRoutes(app);

	return app;
}
