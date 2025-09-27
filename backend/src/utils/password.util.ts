import bcrypt from 'bcryptjs';
import { AppError } from './errors.util.ts';

export async function validatePassword(password: string) {
	//TODO: Add more password validations
	if (password.length < 6) {
		throw new AppError({
			message: 'A senha deve ter no mínimo 6 caracteres',
			errorCode: 'BAD_REQUEST',
		});
	}

	password = await bcrypt.hash(password, 10);
	return password;
}

export async function comparePassword(password: string, password_hash: string) {
	const isValid = await bcrypt.compare(password, password_hash);
	return isValid;
}
