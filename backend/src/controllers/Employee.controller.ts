import { FastifyRequest } from 'fastify';
import { CreateEmployee, EmployeeQuerystring } from '@/schemas/employee.schema';
import { AppError, HttpError } from '@/utils/errors.util';
import { EmployeeService } from '@/services/Employee.service';
import { IJwtAuthPayload } from '@/types/authorization.types';

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
	async getAllEmployee(request: FastifyRequest) {
		try {
			const { skip, take, ...filters } = request.query as {
				skip: number;
				take: number;
			} & EmployeeQuerystring;
			const response = await this.employeeService.getEmployees(
                filters as EmployeeQuerystring,
				skip,
				take,
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
	async getEmployee(request: FastifyRequest) {
		try {
			const { skip, take, ...filters } = request.query as {
				skip: number;
				take: number;
			} & EmployeeQuerystring;
			const { storeId } = request.user as IJwtAuthPayload;
			const response = await this.employeeService.getEmployees(
                filters as EmployeeQuerystring,
				skip,
				take,
				storeId!,
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
