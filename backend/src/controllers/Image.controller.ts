import {
	GenerateCloudinaryImageUrlParams,
	IImageService,
} from '@/types/image.types';
import { FastifyRequest } from 'fastify';

export class ImageController {
	constructor(private imageService: IImageService) {}

	generateImageUrl(request: FastifyRequest) {
		const { publicId } = request.query as { publicId: string };
		const params = request.query as GenerateCloudinaryImageUrlParams;

		const url = this.imageService.generateUrl(publicId, params);

		return { url };
	}
}
