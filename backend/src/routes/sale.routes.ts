import { SaleController } from '@/controllers/Sale.controller';
import { newSaleSchema } from '@/schemas/sale.schema';
import { SaleService } from '@/services/Sale.service';
import { fastifyTypedInstance } from '@/types/types';
import { ApiResponse } from '@/utils/api-response.util';
import prisma from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

export function saleRoutes(app: fastifyTypedInstance) {
	const saleService = new SaleService(prisma);
	const saleController = new SaleController(saleService);

	app.get(
		'/',
		{
			schema: {
				tags: ['Sale'],
				summary: 'Busca todas as vendas',
			},
			preHandler: app.authorization(),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await saleController.getSales(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Vendas encontradas',
					data: response,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.post(
		'/',
		{
			schema: {
				tags: ['Sale'],
				summary: 'Cria uma nova venda',
				body: newSaleSchema,
			},
			preHandler: app.authorization(),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await saleController.newSale(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Venda criada com sucesso',
					data: response,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);

	app.delete(
		'/:id',
		{
			schema: {
				tags: ['Sale'],
				summary: 'cancela uma venda',
			},
			preHandler: app.authorization(),
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const response = await saleController.cancelSale(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Venda cancelada com sucesso',
					data: response,
				}).send(reply);
			} catch (error) {
				return new ApiResponse({
					success: false,
					statusCode: error.statusCode,
					message: error.message,
					errorCode: error.errorCode,
				}).send(reply);
			}
		},
	);
}
