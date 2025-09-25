type StoreType = 'BRANCH' | 'HEADQUARTERS';

interface OpeningHours {
	day: string;
	open: string;
	close: string;
}

export interface IStoreProps {
	name: string;
	code: string;
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
	latitude?: number;
	longitude?: number;
	opening_hours: OpeningHours[];
	is_active?: boolean;
}
