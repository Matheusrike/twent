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
			use_filename: true,
			resource_type: 'image',
		});

		fs.unlinkSync(filePath);

		return { url: result.url, publicId: result.public_id };
	} catch (error) {
		console.error(error);
		throw new Error('Error uploading file to Cloudinary');
	}
}

export async function deleteFromCloudinary(publicId: string) {
	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.error(error);
		throw new Error('Error deleting file from Cloudinary');
	}
}
