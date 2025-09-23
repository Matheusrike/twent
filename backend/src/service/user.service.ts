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

	async update(id: string, userData: Partial<Iuser>) {
		try {
			const parsed = UserSchema.partial().parse(userData);

			if (parsed.password_hash) {
				parsed.password_hash = await bcrypt.hash(
					parsed.password_hash,
					10,
				);
			}

			if (parsed.birth_date) {
				parsed.birth_date = new Date(parsed.birth_date);
			}

			return await prisma.user.update({
				where: { id },
				data: parsed,
			});
		} catch (error) {
			return error;
		}
	}

    async statusUser(id: string, newStatus: boolean ) {
        try {
            return await prisma.user.update({
                where: {id: id},
                data: {is_active: newStatus}
            })            
        } catch (error) {
            return error
        }
    }
}
