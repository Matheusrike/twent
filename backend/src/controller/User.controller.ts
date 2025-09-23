import { FastifyRequest, FastifyReply } from "fastify";
import { UserSchema } from "../schema/user.schema.ts";
import { UserService } from "../service/user.service.ts";

const User = new UserService

export class UserController {

    async create(request: FastifyRequest, reply: FastifyReply){
        try {
            const parsed = UserSchema.parse(request.body)

            await User.create(parsed)
            reply.send({message: "Criado com sucesso"})
        } catch (error) {
            // TODO: needs to return appropriate error
            return error            
        }
    }

    async getAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const users = await User.getAll()
            reply.send(users)
        } catch (error) {
            // TODO: needs to return appropriate error
            return error
        }
    }
}