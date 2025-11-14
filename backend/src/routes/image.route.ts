import { fastifyTypedInstance } from '@/types/types';
import { ImageController } from '@/controllers/Image.controller';
import { ImageService } from '@/services/Image.service';
import {
	generateImageUrlResponseSchema,
	getImageUrlParams,
} from '@/schemas/image.schema';
import { ApiResponse } from '@/utils/api-response.util';
import { HttpError } from '@/utils/errors.util';

export async function imageRoutes(app: fastifyTypedInstance) {
	const imageService = new ImageService();
	const imageController = new ImageController(imageService);

	app.get(
		'/url',
		{
			schema: {
                tags: ['Image'],
				querystring: getImageUrlParams,
				response: {
					200: generateImageUrlResponseSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				const response = imageController.generateImageUrl(request);
				new ApiResponse({
					statusCode: 200,
					success: true,
					message: 'URL da imagem gerada com sucesso',
					data: response,
				}).send(reply);
			} catch (error) {
				if (error instanceof HttpError) {
					return new ApiResponse({
						statusCode: error.statusCode,
						success: false,
						message: error.message,
					}).send(reply);
				}

				return ApiResponse.genericError(reply);
			}
		},
	);
}
