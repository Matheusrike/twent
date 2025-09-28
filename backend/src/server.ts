import { configDotenv } from 'dotenv';
import Fastify from 'fastify';
import type { FastifyInstance } from 'fastify';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import authorizationPlugin from './plugins/authorization.plugin.ts';
import { customerRoute } from './routes/customer.route.ts';
import { userRoute } from './routes/user.route.ts';
import { employeeRoute } from './routes/employee.route.ts';

// Basic configs
configDotenv({ quiet: true });
const app: FastifyInstance = Fastify();
const port: number = parseInt(process.env.PORT!);

// Plugins registration
app.register(cookie, {
	secret: process.env.COOKIE_SECRET!,
});
app.register(jwt, {
	secret: process.env.JWT_SECRET!,
});
app.register(authorizationPlugin);

// Routes
app.register(customerRoute);
app.register(employeeRoute);
app.register(userRoute);

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
