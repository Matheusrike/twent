import { IApiResponseOptions } from '../types/types';
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
		const response = Object.fromEntries(
			Object.entries({
				success: this.success,
				message: this.message,
				data: this.data,
				errors: this.errors,
				errorCode: this.errorCode,
			}).filter(([, value]) => value !== null),
		);

		return reply.status(this.statusCode).send(response);
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
