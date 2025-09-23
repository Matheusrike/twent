export interface IApiResponseOptions<T, E> {
	statusCode: number;
	success: boolean;
	message: string;
	data?: T | null;
	errors?: E | null;
	errorCode?: string | null;
}

export interface IApiErrorOptions {
	statusCode: number;
	errorCode: string;
}
