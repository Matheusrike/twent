import { FastifyRequest, FastifyReply } from 'fastify';
import { UserSchema } from '../schemas/user.schema.ts';
import { EmployeeSchema } from '@/schemas/employee.schema.ts';
import { HttpError } from '../utils/errors.util.ts';
import { ApiResponse } from '../utils/api-response.util.ts';
import {
	IEmployeeProps,
	IUser,
	TypeGetUserProps,
} from '../types/users.types.ts';
import { EmployeeService } from '../services/Employee.service.ts';

export class EmployeeController {
	constructor(private employeeService: EmployeeService) {}
	async create(
		request: FastifyRequest<{
			Body: { userData: IUser; employeeData: IEmployeeProps };
			Headers: { 'x-role-name': string; 'x-store-code': string };
		}>,
		reply: FastifyReply,
	) {
		try {
			const parsedUserData = UserSchema.safeParse(request.body.userData);

			const parsedEmployeeData = EmployeeSchema.safeParse(
				request.body.employeeData,
			);

			if (!parsedUserData.success || !parsedEmployeeData.success) {
				throw new HttpError({
					message: 'Dados enviados incorretos',
                    errorCode: 'BAD_REQUEST',
					statusCode: 400,
				});
			}

			const roleName = request.headers['x-role-name'];
			const storeCode = request.headers['x-store-code'];
			if (!roleName) {
				throw new HttpError({
					message: 'Cabeçalho x-role-name é obrigatório',
                    errorCode: 'BAD_REQUEST',
					statusCode: 400,
				});
			}
			if (!storeCode) {
				throw new HttpError({
					message: 'Cabeçalho x-store-code é obrigatório',
                    errorCode: 'BAD_REQUEST',
					statusCode: 400,
				});
			}
			await this.employeeService.create(
				parsedUserData.data,
				parsedEmployeeData.data,
				roleName,
				storeCode,
			);

			new ApiResponse({
				statusCode: 201,
				success: true,
				message: 'Funcionário cadastrado com sucesso ',
			}).send(reply);
		} catch (error) {
			switch (error.errorCode) {
				case 'CONFLICT':
					throw new HttpError({
						message: error.message,
                        errorCode: error.errorCode,
						statusCode: 409,
					});
				case 'BAD_REQUEST':
					throw new HttpError({
						message: error.message,
                        errorCode: error.errorCode,
						statusCode: 400,
					});
				case 'NOT_FOUND':
					throw new HttpError({
						message: error.message,
                        errorCode: error.errorCode,
						statusCode: 404,
					});
				case 'BAD_GATEWAY':
					throw new HttpError({
						message: error.message,
                        errorCode: error.errorCode,
						statusCode: 502,
					});
				case 'GATEWAY_TIMEOUT':
					throw new HttpError({
						message: error.message,
                        errorCode: error.errorCode,
						statusCode: 504,
					});
				default:
					throw new HttpError({
						message: error.message,
                        errorCode: error.errorCode,
						statusCode: 500,
					});
			}
		}
	}
	async get(request: FastifyRequest, reply: FastifyReply) {
		try {
			const { skip, take, ...filters } =
				request.query as TypeGetUserProps;

			const response = await this.employeeService.get(
				filters,
				skip,
				take,
			);

			new ApiResponse({
				statusCode: 200,
				success: true,
				message: 'Informação(ões) do(s) usuário(s) encontrada(s)',
				data: response,
			}).send(reply);
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

	async update(
		request: FastifyRequest<{
			Params: { id: string };
			Body: { userData: IUser; employeeData: IEmployeeProps };
			Headers: { 'x-role-name': string; 'x-store-code': string };
		}>,
		reply: FastifyReply,
	) {
		try {
			const id = request.params['id'];

			const parsedUserData = UserSchema.partial().parse(
				request.body.userData,
			);

			const parsedEmployeeData = EmployeeSchema.partial().parse(
				request.body.employeeData,
			);

			const roleName = request.headers['x-role-name'];
			const storeCode = request.headers['x-store-code'];

			await this.employeeService.update(
				id,
				parsedUserData,
				parsedEmployeeData,
				roleName,
				storeCode,
			);
			new ApiResponse({
				success: true,
				statusCode: 200,
				message: 'Funcionario atualizado com sucesso',
				data: null,
			}).send(reply);
		} catch (error) {
			switch (error.errorCode) {
				case 'NOT_FOUND':
					return new HttpError({
						message: error.message,
						statusCode: 404,
					});
				case 'UNAUTHORIZED':
					return new HttpError({
						message: error.message,
						statusCode: 401,
					});
				case 'BAD_REQUEST':
					return new HttpError({
						message: error.message,
						statusCode: 400,
					});
				case 'CONFLICT':
					return new HttpError({
						message: error.message,
						statusCode: 409,
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
}
