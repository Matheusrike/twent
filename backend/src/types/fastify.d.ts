import 'fastify';
import { IAuthorizationOptions } from '@/types/authorization.types';

declare module 'fastify' {
	interface FastifyInstance {
		authorization: (
			options?: IAuthorizationOptions,
		) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
	}

	interface FastifyRequest {
		user?: {
			id: string;
			roles: string[];
		};
	}
}
