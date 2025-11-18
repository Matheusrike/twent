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
	return async (
		request: FastifyRequest,
		reply: FastifyReply,
	): Promise<void> => {
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

			const decoded = request.server.jwt.verify<IJwtAuthPayload>(token);
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
			}

			switch (error.code) {
				case 'FAST_JWT_INVALID_SIGNATURE':
					return new ApiResponse({
						success: false,
						statusCode: 401,
						message: 'Token de autenticação inválido',
						errorCode: 'INVALID_TOKEN',
					}).send(reply);

				case 'FAST_JWT_EXPIRED':
					return new ApiResponse({
						success: false,
						statusCode: 401,
						message: 'Token de autenticação expirado',
						errorCode: 'TOKEN_EXPIRED',
					}).send(reply);
				case 'FAST_JWT_MALFORMED':
					return new ApiResponse({
						success: false,
						statusCode: 401,
						message: 'Token de autenticação malformado',
						errorCode: 'MALFORMED_TOKEN',
					}).send(reply);
			}
			console.error(error);
			return ApiResponse.genericError(reply);
		}
	};
}

async function authorizationPlugin(fastify: FastifyInstance) {
	fastify.decorate('authorization', authorization);
}

export default fp(authorizationPlugin, {
	name: 'authorization',
});
