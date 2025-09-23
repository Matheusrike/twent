import prisma from '../../prisma/client.ts';
import { IUser, UserSchema } from '../schema/user.schema.ts';

export class User {
	static async getAll() {
		try {
			return await prisma.user.findMany();
		} catch (error) {
			// TODO: needs to return appropriate error
			return error;
		}
	}

	static async create(userData: IUser) {
		try {
			const parsed = UserSchema.parse(userData);

			const user = await prisma.user.create({
				data: parsed,
			});

			console.log('Usuário criado:', user);
		} catch (error) {
			// TODO: needs to return appropriate error
			return error;
		}
	}
}
