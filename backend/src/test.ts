import { FastifyInstance } from 'fastify';

export async function testRoutes(fastify: FastifyInstance) {
	// rota pública, sem autenticação
	fastify.get('/public', async () => {
		return { msg: 'Essa rota é pública' };
	});

	// rota protegida, apenas usuário autenticado
	fastify.get(
		'/private',
		{ preHandler: [fastify.authorization()] }, // sem roles
		async (request, reply) => {
			return reply.status(200).send({
				msg: 'Você está autenticado!',
				user: request.user, // vem do decoded JWT
			});
		},
	);

	// rota protegida, apenas admin
	fastify.get(
		'/admin',
		{ preHandler: [fastify.authorization({ requiredRoles: ['admin'] })] },
		async (request) => {
			return {
				msg: 'Bem-vindo, admin!',
				user: request.user,
			};
		},
	);
}
