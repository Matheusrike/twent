export interface IImageService {
	upload(filePath: string, folder: string): Promise<CloudinaryResult>;
	delete(publicId: string): Promise<void>;
	generateUrl(params: GenerateCloudinaryImageUrlParams): string;
}

export interface CloudinaryResult {
	url: string;
	publicId: string;
}

export interface GenerateCloudinaryImageUrlParams {
	publicId: string;
	width?: number;
	height?: number;
	quality?: string | number;
	format?: string;
	crop?: string;
}
