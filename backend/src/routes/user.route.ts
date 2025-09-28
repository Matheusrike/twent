import { FastifyInstance } from "fastify";
import { UserController } from "../controller/User.controller.ts";

export function userRoute(fastify: FastifyInstance) {
    const userController = new UserController();
    fastify.get('/user', userController.get);

    fastify.get('/user/:id/profile', userController.getInfo);

    fastify.put('/user/:id/status', userController.changeStatus);
}