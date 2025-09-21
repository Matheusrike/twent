import { configDotenv } from 'dotenv';
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import authorizationPlugin from './plugins/authorization.plugin.ts';

configDotenv({ quiet: true });

const app: FastifyInstance = Fastify();
const port: number = parseInt(process.env.PORT || '3000', 10);

// Plugins
app.register(cookie, {
	secret: process.env.COOKIE_SECRET!,
});
app.register(jwt, {
	secret: process.env.JWT_SECRET!,
});
app.register(authorizationPlugin);

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
