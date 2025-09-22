import { FastifyInstance } from "fastify";
import { UserController } from "../controller/User.controller.ts";

const { create, getAll } = new UserController

export async function userRoute(fastify: FastifyInstance) {
    fastify.get("/users", getAll)

    fastify.post("/users", create )
}