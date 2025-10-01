import { FastifyRequest, FastifyReply } from 'fastify';
import { EmployeeSchema } from '../schema/user.schema.ts';
import { HttpError } from '../utils/errors.util.ts';
import { ApiResponse } from '../utils/api-response.util.ts';
import { IEmployeeProps, TypeGetUserProps } from '../types/users.types.ts';
import { EmployeeService } from '../service/employee.service.ts';

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
			Querystring: TypeGetUserProps;
		}>,
		reply: FastifyReply,
	) {
		try {

			const {skip, take, ...filters} = request.query;

            console.log(filters, skip, take);

			const response = await this.service.get(filters, skip, take);

			return reply.status(200).send(
				new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Informações do usuário encontradas',
					data: response,
				}),
			);
		} catch (error) {
			switch (error?.errorCode) {
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
					console.error(error);
					return new HttpError({
						message: error?.message ?? 'Erro interno',
						statusCode: 500,
					});
			}
		}
	}
    
}
