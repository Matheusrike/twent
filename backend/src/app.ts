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

	await registerPlugins(app, config);
	await registerRoutes(app);

	return app;
}
