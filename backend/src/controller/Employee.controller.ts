import { FastifyRequest, FastifyReply } from 'fastify';
import { EmployeePropsSchema, UserSchema } from '../schema/user.schema.ts';
import { HttpError } from '../utils/errors.util.ts';
import { ApiResponse } from '../utils/api-response.util.ts';
import { IUser, TypeEmployeeProps } from '../types/users.types.ts';
import { EmployeeService } from '../service/employee.service.ts';
import { Prisma } from '../../prisma/generated/prisma/index.js';

const employeeService = new EmployeeService();

export class EmployeeController {
	private service: EmployeeService;
	constructor() {
		this.service = employeeService;
		this.create = this.create.bind(this);
	}
	async create(
		request: FastifyRequest<{
			Body: { employeeData: IUser; employeeProps: TypeEmployeeProps };
			Headers: { 'x-role-name': string; 'x-store-code': string };
		}>,
		reply: FastifyReply,
	) {
		try {
			const parsedData = UserSchema.safeParse(request.body.employeeData);
			const parsedProps = EmployeePropsSchema.safeParse(
				request.body.employeeProps,
			);
            console.log(parsedProps, parsedData);
            
			if (!parsedData.success || !parsedProps.success) {
				return new HttpError({
					message: 'Dados enviados incorretos',
					statusCode: 400,
				});
			}
			const roleName = request.headers['x-role-name'];
			const storeCode = request.headers['x-store-code'];
			const employeeProps = request.body.employeeProps;
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
			if (!employeeProps) {
				return new HttpError({
					message: 'Propriedades do funcionário são obrigatórias',
					statusCode: 400,
				});
			}

			if (parsedProps.data.salary !== undefined) {
				parsedProps.data.salary = new Prisma.Decimal(
					String(parsedProps.data.salary),
				);
			}
			await this.service.create(
				parsedData.data!,
				roleName,
				storeCode,
				parsedProps.data!,
			);
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
}
