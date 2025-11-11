export interface IImageService {
	uploadFile(filePath: string, folder: string): Promise<CloudinaryResult>;
	delete(publicId: string): Promise<void>;
	generateUrl(
		publicId: string,
		params: GenerateCloudinaryImageUrlParams,
	): string;
	uploadFiles(
		filePaths: string[],
		folder: string,
	): Promise<CloudinaryResult[]>;
}

export interface CloudinaryResult {
	url: string;
	publicId: string;
}

export interface GenerateCloudinaryImageUrlParams {
	width?: number;
	height?: number;
	quality?: string | number;
	format?: string;
	crop?: string;
}
