export interface IApiResponseOptions<T, E> {
	statusCode: number;
	success: boolean;
	message: string;
	data?: T | null;
	errors?: E | null;
	errorCode?: string | null;
}

export interface IApiResponseError<E> {
	success: false;
	message: string;
	errors: E;
	errorCode?: string;
}
