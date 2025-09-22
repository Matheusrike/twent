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

            if (parsed.birth_date){
                parsed.birth_date = new Date(userData.birth_date!)
            }
            // TODO: logic unfinished
		} catch (error) {
            return error
        }
	}
}
