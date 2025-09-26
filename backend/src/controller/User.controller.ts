import { FastifyRequest, FastifyReply } from 'fastify';
import { UserSchema } from '../schema/user.schema.ts';
import { UserService } from '../service/user.service.ts';
import { HttpError } from '../utils/errors.util.ts';

const userService = new UserService();

export class UserController {
	private service: UserService;
	constructor() {
		this.service = userService;

		this.create = this.create.bind(this);
		this.getAll = this.getAll.bind(this);
		this.update = this.update.bind(this);
		this.statusUser = this.statusUser.bind(this);
	}

	async create(request: FastifyRequest, reply: FastifyReply) {
		try {
			const parsed = UserSchema.safeParse(request.body);

			if (!parsed.success) {
				return new HttpError({
					message: 'Dados enviados incorretos',
					statusCode: 400,
				});
			}

			const response = await this.service.create(parsed.data!);
			reply.send(response);
		} catch (error) {
			if (error.errorCode == 'CONFLICT') {
				return new HttpError({
					message: error.message,
					statusCode: 409,
				});
			}
		}
	}

	async getAll(
		request: FastifyRequest<{ Querystring: { [key: string]: string } }>,
		reply: FastifyReply,
	) {
		try {
			const query = request.query;
			if (query) {
				const response = await this.service.get(query);
				reply.send(response);
			}
			const users = await this.service.getAll();
			reply.send(users);
		} catch (error) {
			return new HttpError({
				message: error.message,
				statusCode: 500,
			});
		}
	}

	async update(request: FastifyRequest, reply: FastifyReply) {
		try {
			const id = '0c3c9290-46ff-491b-8434-8fb60fe1cd29';
			const parsed = UserSchema.partial().parse(request.body);

			await this.service.update(id, parsed);
			reply.send({ message: 'Usuário atualizado' });
		} catch (error) {
			return new HttpError({
				message: error.message,
				statusCode: 500,
			});
		}
	}

	async statusUser(request: FastifyRequest, reply: FastifyReply) {
		try {
			const id = '0c3c9290-46ff-491b-8434-8fb60fe1cd29';
			const { is_active } = UserSchema.partial().parse(request.body);

			await this.service.statusUser(id, is_active!);

			reply.send({ message: 'Status mudado' });
		} catch (error) {
			return new HttpError({
				message: error.message,
				statusCode: 500,
			});
		}
	}
}
