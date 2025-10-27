import { FastifyRequest, FastifyReply } from 'fastify';
import { EmployeeBodySchema } from '@/schemas/employee.schema.ts';
import { HttpError } from '@/utils/errors.util.ts';
import { ApiResponse } from '@/utils/api-response.util.ts';
import { IEmployeeProps, TypeGetUserProps } from '@/types/users.types.ts';
import { EmployeeService } from '@/services/Employee.service.ts';

export class EmployeeController {
	constructor(private employeeService: EmployeeService) {}

	async create(
		request: FastifyRequest<{
			Body: { data: IEmployeeProps };
		}>,
		reply: FastifyReply,
	) {
		try {
			const { id } = request.user as { id: string };
			const parsed = EmployeeBodySchema.safeParse(request.body);

			if (!parsed.success) {
				throw new HttpError({
					message: 'Dados enviados incorretos',
					errorCode: 'BAD_REQUEST',
					statusCode: 400,
				});
			}

			await this.employeeService.create(parsed.data, id);

			new ApiResponse({
				statusCode: 201,
				success: true,
				message: 'Funcionário cadastrado com sucesso ',
				data: null,
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
					throw new HttpError({
						message: error.message,
						statusCode: 400,
					});
				case 'NOT_FOUND':
					throw new HttpError({
						message: error.message,
						statusCode: 404,
					});
				default:
					console.error(error);
					throw new HttpError({
						message: error?.message ?? 'Erro interno',
						statusCode: 500,
					});
			}
		}
	}

	async update(
		request: FastifyRequest<{
			Params: { id: string };
			Body: { data: IEmployeeProps };
		}>,
		reply: FastifyReply,
	) {
		try {
			const id = request.params['id'];

			const parsed = EmployeeBodySchema.partial().safeParse(request.body);

			await this.employeeService.update(id, parsed.data);
			new ApiResponse({
				success: true,
				statusCode: 200,
				message: 'Funcionario atualizado com sucesso',
				data: null,
			}).send(reply);
		} catch (error) {
			switch (error.errorCode) {
				case 'NOT_FOUND':
					throw new HttpError({
						message: error.message,
						statusCode: 404,
					});
				case 'UNAUTHORIZED':
					throw new HttpError({
						message: error.message,
						statusCode: 401,
					});
				case 'BAD_REQUEST':
					throw new HttpError({
						message: error.message,
						statusCode: 400,
					});
				case 'CONFLICT':
					throw new HttpError({
						message: error.message,
						statusCode: 409,
					});
				case 'BAD_GATEWAY':
					throw new HttpError({
						message: error.message,
						statusCode: 502,
					});
				case 'GATEWAY_TIMEOUT':
					throw new HttpError({
						message: error.message,
						statusCode: 504,
					});
				default:
					throw new HttpError({
						message: error.message,
						statusCode: 500,
					});
			}
		}
	}
}
