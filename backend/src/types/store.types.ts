import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '../../prisma/generated/prisma/index.js';

type StoreType = 'BRANCH' | 'HEADQUARTERS';

export interface IStoreProps {
	name: string;
	type: StoreType;
	email: string;
	phone?: string;
	street: string;
	number: string;
	district: string;
	city: string;
	state: string;
	zip_code: string;
	country: string;
	latitude?: Decimal;
	longitude?: Decimal;
	opening_hours: Prisma.InputJsonValue;
	is_active?: boolean;
}

export type TypeGetStoreProps = Prisma.StoreWhereInput & {
    id?: string;
    name?: string;
    type?: StoreType;
    email?: string;
    phone?: string;
    street?: string;
    number?: string;
    district?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: Decimal;
    longitude?: Decimal;
    opening_hours?: Prisma.InputJsonValue;
    is_active?: boolean;
};
