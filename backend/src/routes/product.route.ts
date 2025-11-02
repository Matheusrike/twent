import { fastifyTypedInstance } from '@/types/types';
import { ProductController } from '@/controllers/Product.controller';
import { ProductService } from '@/services/Product.service';
import { createProductSchema } from '@/schemas/product.schema';
import prisma from '@prisma/client';
import { ApiResponse } from '@/utils/api-response.util';
import { HttpError } from '@/utils/errors.util';

export async function productRoutes(app: fastifyTypedInstance) {
	const productService = new ProductService(prisma);
	const productController = new ProductController(productService);

	app.post(
		'/',
		{
			schema: {
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
}
