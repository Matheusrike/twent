import { validateLocation } from '../helpers/validate-location.helper.ts';
import { User } from '../model/User.model.ts';
import { IUser, UserSchema } from '../schema/user.schema.ts';
import bcrypt from 'bcryptjs';


export class UserService {
	async create(userData: IUser) {
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
			return await User.create(parsed);
		} catch (error) {
            // TODO: needs to return appropriate error
			return error;
		}
	}

	async getAll() {
		try {
			return await User.getAll();
		} catch (error) {
            // TODO: needs to return appropriate error
			return error;
		}
	}
}
