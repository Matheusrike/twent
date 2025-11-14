import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
	try {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	} catch (error) {
		throw new Error('Error hashing password: ', error);
	}
}
