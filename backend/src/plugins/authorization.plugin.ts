import type { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import type {
	IJwtAuthPayload,
	IAuthorizationOptions,
} from '../types/authorization.ts';
import { getToken } from '../helpers/get-token.helper.js';
import { ApiResponse, ApiError } from '../utils/api-responses.util.ts';

function authorization(options: IAuthorizationOptions = {}) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { requiredRoles } = options;

			const token = getToken(request);
			if (!token) {
				throw new ApiError('token não encontrado', 'UNAUTHORIZED', 401);
			}

			const decoded: IJwtAuthPayload =
				await request.server.jwt.verify(token);
			request.user = decoded;

			// Verifica se há roles requeridas e verifica se o usuário possui elas
			if (requiredRoles && !requiredRoles.includes(decoded.role)) {
				throw new ApiError(
					'acesso negado, você não tem permissão suficiente para realizar essa operação',
					'FORBIDDEN',
					403,
				);
			}
		} catch (error) {
			if (error instanceof ApiError) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}

			console.error(error);
			return ApiResponse.genericError(reply);
		}
	};
}

export async function authorizationPlugin(fastify: FastifyInstance) {
	fastify.decorate('authorization', authorization);
}
