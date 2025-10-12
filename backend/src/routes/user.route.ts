import type { fastifyTypedInstance } from '../types/types.ts';
import { UserController } from '../controllers/User.controller.ts';
import { UserService } from '@/services/User.service.ts';

export function userRoute(fastify: fastifyTypedInstance) {
	const userService = new UserService();
	const userController = new UserController(userService);

	fastify.get(
		'/:id/profile',
		{ preHandler: fastify.authorization() },
		userController.getInfo.bind(userController),
	);

	fastify.put(
		'/:id/status',
		{
			preHandler: fastify.authorization({
				requiredRoles: [
					'ADMIN',
					'MANAGER_HQ',
					'MANAGER_BRANCH',
				],
			}),
		},
		userController.changeStatus.bind(userController),
	);
}
