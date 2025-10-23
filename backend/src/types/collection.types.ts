import { GenderTarget } from '@prisma/generated/enums';

export interface ICreateCollection {
	name: string;
	description?: string;
	launch_year?: number;
	target_gender?: GenderTarget;
	price_range_min?: number;
	price_range_max?: number;
	image_banner?: string;
	is_active?: boolean;
}

export interface IUpdateCollection {
	name?: string;
	description?: string;
	launch_year?: number;
	target_gender?: GenderTarget;
	price_range_min?: number;
	price_range_max?: number;
	image_banner?: string;
	is_active?: boolean;
}

export interface ICollectionFilters {
	name?: string;
	target_gender?: GenderTarget;
	is_active?: boolean;
	launch_year?: number;
}

export { GenderTarget };
