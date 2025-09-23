import { FastifyRequest, FastifyReply } from 'fastify';
import { UserSchema } from '../schema/user.schema.ts';
import { UserService } from '../service/user.service.ts';

const userService = new UserService();

export class UserController {
	private service: UserService;
	constructor() {
		this.service = userService;
		this.create = this.create.bind(this);
		this.getAll = this.getAll.bind(this);
	}

	async create(request: FastifyRequest, reply: FastifyReply) {
		try {
			const parsed = UserSchema.parse(request.body);

			await this.service.create(parsed);
			reply.send({ message: 'Criado com sucesso' });
		} catch (error) {
			// TODO: needs to return appropriate error
			return error;
		}
	}

	async getAll(request: FastifyRequest, reply: FastifyReply) {
		try {
			const users = await this.service.getAll();
			reply.send(users);
		} catch (error) {
			// TODO: needs to return appropriate error
			return error;
		}
	}
}
