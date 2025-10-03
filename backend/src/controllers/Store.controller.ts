import { StoreService } from "../services/Store.service.ts";
import { FastifyReply, FastifyRequest } from "fastify";
import { HttpError } from "../utils/errors.util.ts";
import { ApiResponse } from "../utils/api-response.util.ts";
import { StoreSchema } from "../schemas/store.schema.ts";


export class StoreController {
    private service: StoreService

    constructor() {
        this.service = new StoreService();

        this.get = this.get.bind(this);
        this.create = this.create.bind(this);
    }

    async get(request: FastifyRequest, reply: FastifyReply) {
        try {
            const response = await this.service.get();

            return reply.status(200).send(
                new ApiResponse({
                    statusCode: 200,
                    success: true,
                    message: 'Informações das filiais encontradas',
                    data: response,
                }),
            );
        } catch (error) {
            switch (error.errorCode) {
                case 'NOT_FOUND':
                    return new HttpError({
                        message: error.message,
                        statusCode: 404,
                    });
                default:
                    return new HttpError({
                        message: error.message,
                        statusCode: 500,
                    });
            }
        }
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const parsed = StoreSchema.safeParse(request.body);

            if (!parsed.success) {
                return new HttpError({
                    message: 'Dados enviados incorretos',
                    statusCode: 400,
                });
            }

            await this.service.create(parsed.data!);
            reply.status(201).send(
                new ApiResponse({
                    statusCode: 201,
                    success: true,
                    message: 'Filial criada',
                }),
            );
        } catch (error) {
            switch (error.errorCode) {
                case 'CONFLICT':
                    return new HttpError({
                        message: error.message,
                        statusCode: 409,
                    });
                case 'BAD_REQUEST':
                    return new HttpError({
                        message: error.message,
                        statusCode: 400,
                    });
                default:
                    return new HttpError({
                        message: error.message,
                        statusCode: 500,
                    });
            }
        }

    }
}