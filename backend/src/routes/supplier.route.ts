import { fastifyTypedInstance } from '@/types/types';
import { SupplierController } from '@/controllers/Supplier.controller';
import { SupplierService } from '@/services/Supplier.service';
import {
	createSupplierSchema,
	SupplierFiltersSchema,
	SupplierGetResponseSchema,
	updateSupplierSchema,
} from '@/schemas/supplier.schema';
import prisma from '@prisma/client';
import { ApiResponse } from '@/utils/api-response.util';
import { HttpError } from '@/utils/errors.util';

export async function supplierRoutes(app: fastifyTypedInstance) {
	const supplierService = new SupplierService(prisma);
	const supplierController = new SupplierController(supplierService);

	app.post(
		'/',
		{
			schema: {
                tags: ['Supplier'],
                summary: 'Cria um novo fornecedor',
				body: createSupplierSchema,
                response : {

                }
			},
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request, reply) => {
			try {
				const newSupplier = await supplierController.create(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Fornecedor criado com sucesso',
					data: newSupplier,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.get(
		'/',
		{
            schema: {
                tags: ['Supplier'],
                summary: 'Busca todos os fornecedores',
                querystring: SupplierFiltersSchema,
                response: {
                    200:SupplierGetResponseSchema
                }
            },
			preHandler: [
				app.authorization({
					requiredRoles: ['ADMIN', 'MANAGER'],
				}),
			],
		},
		async (request, reply) => {
			try {
				const suppliers = await supplierController.findAll(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Fornecedores recuperados com sucesso',
					data: suppliers,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.get(
		'/:id',
		{
			preHandler: [
				app.authorization({
					requiredRoles: ['ADMIN', 'MANAGER'],
				}),
			],
		},
		async (request, reply) => {
			try {
				const supplier = await supplierController.findById(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Fornecedor recuperado com sucesso',
					data: supplier,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.put(
		'/:id',
		{
			schema: {
				body: updateSupplierSchema,
			},
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request, reply) => {
			try {
				const updatedSupplier =
					await supplierController.update(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Fornecedor atualizado com sucesso',
					data: updatedSupplier,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.patch(
		'/:id/activate',
		{
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request, reply) => {
			try {
				const supplier =
					await supplierController.setActiveStatus(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Fornecedor ativado com sucesso',
					data: supplier,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.delete(
		'/:id',
		{
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request, reply) => {
			try {
				await supplierController.delete(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Fornecedor desativado com sucesso',
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.get(
		'/:id/transactions',
		{
			preHandler: [
				app.authorization({
					requiredRoles: ['ADMIN', 'MANAGER'],
				}),
			],
		},
		async (request, reply) => {
			try {
				const transactions =
					await supplierController.getTransactions(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Transações recuperadas com sucesso',
					data: transactions,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);
}
