import { z } from 'zod';
import { UserTypes } from '../types/users.types.ts';


export const UserSchema = z.object({
	email: z.email(),
	password_hash: z.string().min(6),
	first_name: z.string(),
	last_name: z.string(),
	phone: z.string().optional(),
	user_type: z.enum(UserTypes),
	document_number: z.string().optional(),
	birth_date: z.date().optional(),
	street: z.string().optional(),
	number: z.string().optional(),
	district: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zip_code: z.string().optional(),
	country: z.string().optional(),
    is_active: z.boolean().optional()
});
