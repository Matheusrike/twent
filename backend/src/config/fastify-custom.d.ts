import 'fastify';
import type { FastifyReply } from 'fastify';
import type { IAuthorizationOptions } from '../types/authorization';

declare module 'fastify' {
	interface FastifyInstance {
		authorization: (
			options?: IAuthorizationOptions,
		) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
	}
}
