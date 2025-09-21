import { configDotenv } from 'dotenv';
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import { authorizationPlugin } from './plugins/authorization.plugin.js';
import { testRoutes } from './test.js';

configDotenv({ quiet: true });

const app: FastifyInstance = Fastify();
const port: number = parseInt(process.env.PORT || '3000', 10);

async function buildServer() {
	// PLUGINS
	await app.register(cookie, {
		secret: process.env.COOKIE_SECRET!,
	});

	await app.register(jwt, {
		secret: process.env.JWT_SECRET!,
	});

	await app.register(authorizationPlugin);

	await app.register(testRoutes);

	return app;
}

// Server start
buildServer()
	.then((server) => {
		server.listen({ port: port }, (err) => {
			if (!process.env.PORT) {
				console.warn(
					'⚠ PORT not specified in .env, defaulting to 3000\n',
				);
			}
			console.log(`Server running on http://localhost:${port}`);
			if (err) {
				console.error(err);
				process.exit(1);
			}
		});
	})
	.catch((err) => {
		console.error('Error building server:', err);
		process.exit(1);
	});
