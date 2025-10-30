import { Decimal } from '@prisma/client/runtime/library';
import { Prisma, UserType } from  '@prisma/generated/client';

export interface IUser {
	email: string;
	password_hash: string;
	first_name: string;
	last_name: string;
	phone?: string;
	user_type: UserType;
	document_number?: string;
	birth_date?: Date;
	street?: string;
	number?: string;
	district?: string;
	city?: string;
	state?: string;
	zip_code?: string;
	country?: string;
    is_active?: boolean;
}

export type TypeGetUserProps = Prisma.UserWhereInput & {
	query: {
		store_id?: string;
		first_name?: string;
		last_name?: string;
		phone?: string;
		zip_code?: string;
		document_number?: string;
		id?: string;
		email?: string;
		country?: string;
		street?: string;
		city?: string;
		state?: string;
		user_type?: UserType;
	};
	skip?: number;
	take?: number;
};

export interface IEmployeeProps extends IUser {
	national_id?: string;
	position?: string;
	department?: string;
	salary?: Decimal;
	currency?: string;
	benefits?: object;
	termination_date?: Date;
	emergency_contact?: object;
	is_active?: boolean;
    role: string;
    store_code?: string
}
