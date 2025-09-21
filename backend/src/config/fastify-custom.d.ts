// types/fastify.d.ts
import 'fastify';
import type { IAuthorizationOptions } from './authorization';

declare module 'fastify' {
	interface FastifyInstance {
		// @eslint-disable-next-line @typescript-eslint/no-explicit-any
		authorization(options?: IAuthorizationOptions): any;
	}
}
