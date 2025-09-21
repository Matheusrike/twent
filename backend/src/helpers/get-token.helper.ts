import { FastifyRequest } from 'fastify';

export function getToken(request: FastifyRequest): string | null {
	if (process.env.NODE_ENV === 'prod') {
		return request.cookies.token || null;
	}
	const tokenFromCookie = request.cookies.token;
	const tokenFromHeader = request.headers.authorization
		? request.headers.authorization.split(' ')[1]
		: null;
	return tokenFromCookie || tokenFromHeader || null;
}
