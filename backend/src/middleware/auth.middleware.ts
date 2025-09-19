import Jwt from 'jsonwebtoken';

import { FastifyRequest, FastifyReply, DoneFuncWithErrOrRes } from 'fastify';

export default async function auth(
	request: FastifyRequest,
	reply: FastifyReply,
	done: DoneFuncWithErrOrRes,
) {
	const headers: string = request.headers.authorization!;

	if (!headers) {
		reply.send();
	}

	const [, token] = headers.split(' ');

	try {
		const decoded = Jwt.verify(token, process.env.JWT_SECRET as string);
		request.setDecorator('user', decoded);
        done();
	} catch (error) {
		reply.send(error);
	}

	
}
