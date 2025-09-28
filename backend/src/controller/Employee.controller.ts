import { FastifyRequest, FastifyReply } from 'fastify';
import { EmployeeSchema } from '../schema/user.schema.ts';
import { HttpError } from '../utils/errors.util.ts';
import { ApiResponse } from '../utils/api-response.util.ts';
import { IEmployeeProps, TypeGetUserProps } from '../types/users.types.ts';
import { EmployeeService } from '../service/employee.service.ts';
import { UserType } from '../../prisma/generated/prisma/index.js';

const employeeService = new EmployeeService();

export class EmployeeController {
	private service: EmployeeService;
	constructor() {
		this.service = employeeService;
        
		this.create = this.create.bind(this);
        this.get = this.get.bind(this);
	}
	async create(
		request: FastifyRequest<{
			Body: { employeeData: IEmployeeProps };
			Headers: { 'x-role-name': string; 'x-store-code': string };
		}>,
		reply: FastifyReply,
	) {
		try {
			const parsedData = EmployeeSchema.safeParse(
				request.body.employeeData,
			);

			if (!parsedData.success) {
				return new HttpError({
					message: 'Dados enviados incorretos',
					statusCode: 400,
				});
			}
			const roleName = request.headers['x-role-name'];
			const storeCode = request.headers['x-store-code'];
			if (!roleName) {
				return new HttpError({
					message: 'Cabeçalho x-role-name é obrigatório',
					statusCode: 400,
				});
			}
			if (!storeCode) {
				return new HttpError({
					message: 'Cabeçalho x-store-code é obrigatório',
					statusCode: 400,
				});
			}
			await this.service.create(parsedData.data!, roleName, storeCode);
			reply.status(201).send(
				new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Funcionário criado',
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
				case 'NOT_FOUND':
					return new HttpError({
						message: error.message,
						statusCode: 404,
					});
				case 'BAD_GATEWAY':
					return new HttpError({
						message: error.message,
						statusCode: 502,
					});
				case 'GATEWAY_TIMEOUT':
					return new HttpError({
						message: error.message,
						statusCode: 504,
					});
				default:
					return new HttpError({
						message: error.message,
						statusCode: 500,
					});
			}
		}
	}
	async get(
            request: FastifyRequest<{
                Querystring: {
                    params?: string | string[];
                    cursor?: string;
                    take?: number;
                };
            }>,
            reply: FastifyReply,
        ) {
            try {
                const { params, cursor, take } = request.query;
    
                const paramsObj: TypeGetUserProps = {};
    
                if (params) {
                    const paramArray = Array.isArray(params) ? params : [params];
    
                    for (const paramStr of paramArray) {
                        const match = paramStr.match(/\[(.+?)\]:(.+)/);
                        if (!match) continue;
    
                        const key = match[1].trim() as keyof TypeGetUserProps;
                        const value = match[2].trim();
    
                        if (key === 'take') {
                            paramsObj.take = Number(value);
                        } else if (key === 'user_type') {
                            if (
                                Object.values(UserType).includes(value as UserType)
                            ) {
                                paramsObj.user_type = value as UserType;
                            } else {
                                throw new Error(
                                    `Valor inválido para user_type: ${value}`,
                                );
                            }
                        } else {
                            paramsObj[key] = value;
                        }
                    }
                }
    
                const response = await this.service.get(paramsObj, cursor, take);
    
                reply.status(200).send(
                    new ApiResponse({
                        statusCode: 200,
                        success: true,
                        message:
                            Object.keys(response).length > 2
                                ? 'Usuários encontrados'
                                : 'Usuário encontrado',
                        data: response,
                    }),
                );
            } catch (error) {
                switch (error.errorCode) {
                    case 'BAD_REQUEST':
                        return new HttpError({
                            message: error.message,
                            statusCode: 400,
                        });
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
    
}
