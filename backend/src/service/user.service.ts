import { validateLocation } from '../helpers/validate-location.helper.ts';
import prisma from '../../prisma/client.ts';
import { UserSchema } from '../schema/user.schema.ts';
import bcrypt from 'bcryptjs';
import { Iuser } from '../types/users.types.ts';

export class UserService {
	async create(userData: Iuser) {
		try {
			const parsed = UserSchema.parse(userData);

			const password_hash: string = await bcrypt.hash(
				parsed.password_hash,
				10,
			);

			parsed.password_hash = password_hash;

			if (parsed.birth_date) {
				parsed.birth_date = new Date(userData.birth_date!);
			}
			if (
				parsed.city ||
				parsed.country ||
				parsed.district ||
				parsed.state ||
				parsed.street
			) {
				await validateLocation(parsed);
			}
			return await prisma.user.create({
				data: parsed,
			});
		} catch (error) {
			// TODO: needs to return appropriate error
			return error;
		}
	}

	async getAll() {
		try {
			return await prisma.user.findMany();
		} catch (error) {
			// TODO: needs to return appropriate error
			return error;
		}
	}
}
