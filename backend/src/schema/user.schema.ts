import { z } from 'zod';
import { UserType } from '../../prisma/generated/prisma/index.js';
import { Decimal } from '@prisma/client/runtime/library';

const UserTypes: UserType[] = ['CUSTOMER', 'EMPLOYEE'];

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
	is_active: z.boolean().optional(),
});

export const EmployeePropsSchema = z.object({
	national_id: z.string().optional(),
	position: z.string(),
	department: z.string().optional(),
	salary: z
		.union([z.string(), z.number()])
		.transform((val) => new Decimal(val)),
	currency: z.string(),
	benefits: z.any().optional(),
	termination_date: z.date().optional(),
	emergency_contact: z.any().optional(),
	is_active: z.boolean().optional(),
});

export const EmployeeSchema = UserSchema.merge(EmployeePropsSchema);