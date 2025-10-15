import type { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import type {
	IJwtAuthPayload,
	IAuthorizationOptions,
} from '@/types/authorization.types';
import { getToken } from '@/helpers/get-token.helper';
import { ApiResponse } from '@/utils/api-response.util';
import fp from 'fastify-plugin';
import { HttpError } from '@/utils/errors.util';

function authorization(options: IAuthorizationOptions = {}) {
	return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
		try {
			const { requiredRoles } = options;

			const token = getToken(request);
			if (!token) {
				throw new HttpError({
					message: 'Token de autenticação não encontrado',
					errorCode: 'TOKEN_NOT_FOUND',
					statusCode: 401,
				});
			}

			const decoded = await request.server.jwt.verify<IJwtAuthPayload>(token);
			request.user = decoded;

			// Verifica roles
			if (
				requiredRoles &&
				!requiredRoles.some((role) => decoded.roles.includes(role))
			) {
				throw new HttpError({
					message:
						'Acesso negado, você não tem permissão suficiente para realizar essa operação',
					errorCode: 'UNAUTHORIZED',
					statusCode: 401,
				});
			}
		} catch (error) {
			if (error instanceof HttpError) {
				new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
				return;
			}

			if (error.code === 'FAST_JWT_EXPIRED') {
				new ApiResponse({
					success: false,
					statusCode: 401,
					message: 'Token de autenticação expirado',
					errorCode: 'FAST_JWT_EXPIRED',
				}).send(reply);
				return;
			}

			console.error('Authorization Error:', error);
			ApiResponse.genericError(reply);
			return;
		}
	};
}

async function authorizationPlugin(fastify: FastifyInstance) {
	fastify.decorate('authorization', authorization);
}

export default fp(authorizationPlugin, {
	name: 'authorization',
});
