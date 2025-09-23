import { FastifyInstance } from 'fastify';
import { UserController } from '../controller/User.controller.ts';

const userController = new UserController();

export async function userRoute(fastify: FastifyInstance) {
	fastify.get('/users', userController.getAll);

	fastify.post('/users', userController.create);

	fastify.put('/users', userController.update);

    fastify.put('/users/status/:id', userController.statusUser)
}
