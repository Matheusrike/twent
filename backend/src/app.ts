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
	const app = Fastify().withTypeProvider<ZodTypeProvider>();

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	// Handler global de erros para tratar erros de serialização
	app.setErrorHandler((error, request, reply) => {
		// Trata erros de CORS
		if (error.message && error.message.includes('Origin not allowed')) {
			return reply.status(403).send({
				success: false,
				statusCode: 403,
				message: error.message,
				errorCode: 'CORS_ERROR',
			});
		}

		// Trata outros erros
		console.error('❌ Unhandled error:', error);
		return reply.status(error.statusCode || 500).send({
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
