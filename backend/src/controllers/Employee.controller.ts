import { FastifyRequest } from 'fastify';
import { CreateEmployee } from '@/schemas/employee.schema.ts';
import { AppError, HttpError } from '@/utils/errors.util.ts';
import { TypeGetUserProps } from '@/types/users.types.ts';
import { EmployeeService } from '@/services/Employee.service.ts';

export class EmployeeController {
	constructor(private employeeService: EmployeeService) {}

	async createEmployee(request: FastifyRequest) {
		try {
			const { id } = request.user as { id: string };
			const data = request.body as CreateEmployee;

			const response = await this.employeeService.createEmployee(
				data,
				id,
			);

			return response;
		} catch (error) {
			if (error instanceof AppError) {
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
	}
	async getEmployee(request: FastifyRequest) {
		try {
			const data = request.query as TypeGetUserProps;

			const response = await this.employeeService.getEmployees(
				data
			);

			return response;
		} catch (error) {
			if (error instanceof AppError) {
				switch (error?.errorCode) {
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
					default:
						console.error(error);
						throw new HttpError({
							message: error?.message ?? 'Erro interno',
							errorCode: error.errorCode,
							statusCode: 500,
						});
				}
			}
		}
	}

	async updateEmployee(request: FastifyRequest) {
		try {
			const { id } = request.params as { id: string };

			const data = request.body as Partial<CreateEmployee>;

			await this.employeeService.updateEmployee(id, data);
		} catch (error) {
			if (error instanceof AppError) {
				switch (error.errorCode) {
					case 'NOT_FOUND':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 404,
						});
					case 'UNAUTHORIZED':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 401,
						});
					case 'BAD_REQUEST':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 400,
						});
					case 'CONFLICT':
						throw new HttpError({
							message: error.message,
							errorCode: error.errorCode,
							statusCode: 409,
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
	}
}
