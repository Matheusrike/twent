import { IApiResponseOptions } from '../types/types.ts';
import { FastifyReply } from 'fastify';

export class ApiResponse<T, E> {
	private statusCode: number;
	private success: boolean;
	private message: string;
	private data?: T | null;
	private errors?: E | null;
	private errorCode?: string | null;

	constructor(options: IApiResponseOptions<T, E>) {
		this.statusCode = options.statusCode;
		this.success = options.success;
		this.message = options.message;
		this.data = options.data ?? null;
		this.errors = options.errors ?? null;
		this.errorCode = options.errorCode ?? null;
	}

	send(reply: FastifyReply) {
		return reply.status(this.statusCode).send({
			success: this.success,
			message: this.message,
			data: this.data,
			errors: this.errors,
			errorCode: this.errorCode,
		});
	}

	static genericError(reply: FastifyReply) {
		return new ApiResponse({
			statusCode: 500,
			success: false,
			message: 'Error interno do servidor',
			errorCode: 'INTERNAL_SERVER_ERROR',
		}).send(reply);
	}
}

export class ApiError extends Error {
	statusCode: number;
	errorCode: string;

	constructor(message: string, errorCode: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		this.errorCode = errorCode;
	}
}
