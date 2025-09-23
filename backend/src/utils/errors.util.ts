import { IAppErrorOptions, IHttpErrorOptions } from '../types/errors.type.ts';

export class AppError extends Error {
	errorCode?: string;

	constructor(options: IAppErrorOptions) {
		super(options.message);
		this.errorCode = options.errorCode;
		this.name = 'AppError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, AppError);
		}
	}
}

export class HttpError extends AppError {
	statusCode: number;

	constructor(options: IHttpErrorOptions) {
		super(options);
		this.statusCode = options.statusCode;
		this.name = 'HttpError';

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, HttpError);
		}
	}
}
