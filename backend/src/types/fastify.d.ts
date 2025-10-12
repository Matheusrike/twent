import 'fastify';
import { IAuthorizationOptions } from './authorization.types';

declare module 'fastify' {
  interface FastifyInstance {
    authorization(options?: IAuthorizationOptions): import('fastify').FastifyRequestHandler;
  }
}