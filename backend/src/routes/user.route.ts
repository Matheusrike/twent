import type { fastifyTypedInstance } from '@/types/types';
import { UserController } from '@/controllers/User.controller';
import { UserService } from '@/services/User.service';
import { UserSchema } from '@/schemas/user.schema';

export function userRoute(fastify: fastifyTypedInstance) {
	const userService = new UserService();
	const userController = new UserController(userService);
    
	fastify.get<{ Params: { id: string } }>(
		'/:id/profile',
		{ schema: {
            tags: ['User'],
            summary: 'Busca o perfil de um usuário',
            response: {
                200: UserSchema
            }
        }, preHandler: fastify.authorization() },
		userController.getInfo.bind(userController),
	);

	fastify.put<{ Params: { id: string }; Body: { newStatus: boolean } }>(
		'/:id/status',
		{
			preHandler: fastify.authorization({
				requiredRoles: ['ADMIN', 'MANAGER_HQ', 'MANAGER_BRANCH'],
			}),
		},
		userController.changeStatus.bind(userController),
	);
}
