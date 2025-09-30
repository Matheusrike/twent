import type { fastifyTypedInstance } from '../types/types.ts';
import { UserController } from "../controller/User.controller.ts";

export function userRoute(fastify: fastifyTypedInstance) {
    const userController = new UserController();
    fastify.get('/', {schema: {
        tags: ['User']
    }}, userController.get);

    fastify.post('/search', userController.get);

    fastify.get('/:id/profile', userController.getInfo);

    fastify.put('/:id/status', userController.changeStatus);
}