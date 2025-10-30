export interface IAppErrorOptions {
	message: string;
	errorCode?: string;
}

export interface IHttpErrorOptions extends IAppErrorOptions {
	statusCode: number;
}
