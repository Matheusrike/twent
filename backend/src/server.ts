import { configDotenv } from 'dotenv';
import Fastify from 'fastify';
import type {} from 'fastify-type-provider-zod';
import {
	validatorCompiler,
	serializerCompiler,
	type ZodTypeProvider,
	jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import authorizationPlugin from './plugins/authorization.plugin.ts';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';

// Basic configs
configDotenv({ quiet: true });
const app = Fastify().withTypeProvider<ZodTypeProvider>();
const port: number = parseInt(process.env.PORT || '3000', 10);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Plugins registration
app.register(cookie, {
	secret: process.env.COOKIE_SECRET!,
});
app.register(jwt, {
	secret: process.env.JWT_SECRET!,
});
app.register(authorizationPlugin);

// Documentation plugins registration
app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Twent API',
			version: '1.0.0',
			description: 'Twent API documentation',
		},
	},
	transform: jsonSchemaTransform,
});
app.register(fastifySwaggerUi, {
	routePrefix: '/docs',
});

// Server start
app.listen({ port: port }, (err) => {
	if (!process.env.PORT) {
		console.warn('⚠ PORT not specified in .env, defaulting to 3000\n');
	}
	console.log(`Server running on http://localhost:${port}`);
	if (err) {
		console.error(err);
		process.exit(1);
	}
});
