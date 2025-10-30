import cloudinary from '@/config/cloudinary';
import fs from 'fs';
import {
	CloudinaryResult,
	GenerateCloudinaryImageUrlParams,
	IImageService,
} from '@/types/image.types';
import { AppError } from '@/utils/errors.util';

export class ImageService implements IImageService {
	async upload(filePath: string, folder: string): Promise<CloudinaryResult> {
		try {
			const result = await cloudinary.uploader.upload(filePath, {
				folder,
				use_filename: true,
				resource_type: 'image',
			});

			fs.unlinkSync(filePath);

			return { url: result.url, publicId: result.public_id };
		} catch (error) {
			console.error(error);
			throw new AppError({
				message: 'Erro ao fazer upload da imagem para o Cloudinary',
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	async delete(publicId: string): Promise<void> {
		try {
			await cloudinary.uploader.destroy(publicId);
		} catch (error) {
			console.error(error);
			throw new AppError({
				message: 'Erro ao deletar imagem do Cloudinary',
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}

	generateUrl(
		publicId: string,
		{
			width = undefined,
			height = undefined,
			format = 'webp',
			crop = 'fill',
		}: GenerateCloudinaryImageUrlParams,
	): string {
		try {
			return cloudinary.url(publicId, {
				width,
				height,
				quality: 'auto',
				format,
				crop,
			});
		} catch (error) {
			console.error(error);
			throw new AppError({
				message: 'Erro ao gerar URL da imagem',
				errorCode: 'INTERNAL_SERVER_ERROR',
			});
		}
	}
}
