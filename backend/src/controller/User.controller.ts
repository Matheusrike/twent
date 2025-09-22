import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "../model/User.model.ts";
import { UserSchema } from "../schema/user.schema.ts";

export class UserController {

    async create(request: FastifyRequest, reply: FastifyReply){
        try {
            const parsed = UserSchema.parse(request.body)

            await User.create(parsed)
            reply.send({message: "Criado com sucesso"})
        } catch (error) {
            return error            
        }
    }

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const users = await User.getAll()
            reply.send(users)
        } catch (error) {
            return error
        }
    }
}