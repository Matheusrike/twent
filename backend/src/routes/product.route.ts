import { fastifyTypedInstance } from '@/types/types';
import { ProductController } from '@/controllers/Product.controller';
import { ProductService } from '@/services/Product.service';
import {
	createProductSchema,
	updateProductSchema,
} from '@/schemas/product.schema';
import prisma from '@prisma/client';
import { ApiResponse } from '@/utils/api-response.util';
import { HttpError } from '@/utils/errors.util';

export async function productRoutes(app: fastifyTypedInstance) {
	const productService = new ProductService(prisma);
	const productController = new ProductController(productService);

	app.get(
		'/public',
		{
			schema: {
				tags: ['Product'],
				summary: 'Busca todos os produtos publicos',
			},
		},
		async (request, reply) => {
			try {
				const products = await productController.findAllPublic(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Produtos recuperados com sucesso',
					data: products,
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
		'/public/:sku',
		{
			schema: {
				tags: ['Product'],
				summary: 'Busca um produto publico pelo sku',
			},
		},
		async (request, reply) => {
			try {
				const product =
					await productController.findBySkuPublic(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Produto recuperado com sucesso',
					data: product,
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

	app.post(
		'/',
		{
			schema: {
				tags: ['Product'],
				body: createProductSchema,
			},
			preHandler: [app.authorization({ requiredRoles: ['ADMIN'] })],
		},
		async (request, reply) => {
			try {
				const newProduct = await productController.create(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Produto criado com sucesso',
					data: newProduct,
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
				tags: ['Product'],
				summary: 'Busca todos os produtos',
			},
			preHandler: [
				app.authorization({
					requiredRoles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
				}),
			],
		},
		async (request, reply) => {
			try {
				const products =
					await productController.findAllInternal(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Produtos recuperados com sucesso',
					data: products,
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
		'/:sku',
		{
			schema: {
				tags: ['Product'],
				summary: 'Busca um produto pelo sku',
			},
			preHandler: [app.authorization()],
		},
		async (request, reply) => {
			try {
				const product =
					await productController.findBySkuInternal(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Produto recuperado com sucesso',
					data: product,
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
		'/:sku',
		{
			schema: {
				tags: ['Product'],
				body: updateProductSchema,
			},
			preHandler: [app.authorization()],
		},
		async (request, reply) => {
			try {
				const updatedProduct = await productController.update(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Produto atualizado com sucesso',
					data: updatedProduct,
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
		'/:sku',
		{
			schema: {
				tags: ['Product'],
				summary: 'Desativa um produto',
			},
			preHandler: [app.authorization()],
		},
		async (request, reply) => {
			try {
				await productController.delete(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Produto desativado com sucesso',
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

	app.post(
		'/:sku/images',
		{
			schema: {
				tags: ['Product'],
				summary: 'Carrega imagens para um produto',
			},
			preHandler: [app.authorization()],
		},
		async (request, reply) => {
			try {
				const images = await productController.uploadImages(request);
				return new ApiResponse({
					statusCode: 201,
					success: true,
					message: 'Imagens carregadas com sucesso',
					data: images,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						success: false,
						statusCode: error.statusCode,
						message: error.message,
						errorCode: error.errorCode,
					}).send(reply);
				}
			}
		},
	);

	app.delete(
		'/:sku/images',
		{
			schema: {
				tags: ['Product'],
				summary: 'Remove todas as imagens de um produto',
			},
			preHandler: [app.authorization()],
		},
		async (request, reply) => {
			try {
				await productController.deleteImages(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Imagens removidas com sucesso',
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
		'/:sku/images/primary',
		{
			schema: {
				tags: ['Product'],
				summary: 'Define uma imagem como principal',
			},
			preHandler: [app.authorization()],
		},
		async (request, reply) => {
			try {
				await productController.setPrimaryImage(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Imagem principal definida com sucesso',
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
		'/:sku/price-history',
		{
			schema: {
				tags: ['Product'],
				summary: 'Recupera o histórico de preços de um produto',
			},
			preHandler: [app.authorization()],
		},
		async (request, reply) => {
			try {
				const history =
					await productController.getPriceHistory(request);
				return new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'Histórico de preços recuperado com sucesso',
					data: history,
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
