import {
	FastifyInstance,
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	FastifyBaseLogger,
} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export type IAppConfig = {
	nodeEnv: string;
	port: number;
	databaseUrl: string;
	cookieSecret: string;
	jwtSecret: string;
	adminPassword: string;
	cloudinaryCloudName: string;
	cloudinaryApiKey: string;
	cloudinaryApiSecret: string;
};

export type fastifyTypedInstance = FastifyInstance<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	FastifyBaseLogger,
	ZodTypeProvider
>;

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
