import type { fastifyTypedInstance } from '../types/types.ts';
import { UserController } from '../controllers/User.controller.ts';
import { UserService } from '@/services/User.service.ts';

export function userRoute(fastify: fastifyTypedInstance) {
	const userService =  new UserService();
    const userController = new UserController(userService);

	fastify.get('/:id/profile', userController.getInfo.bind(userController));

	fastify.put('/:id/status', userController.changeStatus.bind(userController));
}
