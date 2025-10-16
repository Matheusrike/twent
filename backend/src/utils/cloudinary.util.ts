import cloudinary from '@/config/cloudinary';
import fs from 'fs';

interface cloudinaryResult {
	url: string;
	publicId: string;
}

export async function uploadToCloudinary({
	filePath,
	folder,
}: {
	filePath: string;
	folder: string;
}): Promise<cloudinaryResult> {
	try {
		const result = await cloudinary.uploader.upload(filePath, {
			folder,
			resource_type: 'image',
		});

		fs.unlinkSync(filePath);

		return { url: result.url, publicId: result.public_id };
	} catch (error) {
		throw new Error('Error uploading file to Cloudinary: ', error);
	}
}
