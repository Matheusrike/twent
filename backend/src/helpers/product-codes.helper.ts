import prisma from '@prisma/client';

export async function generateUniqueSKU() {
	const year = new Date().getFullYear().toString();
	const prefix = `TW-${year}-`;

	const lastProduct = await prisma.product.findFirst({
		where: {
			sku: {
				startsWith: prefix,
			},
		},
		orderBy: {
			created_at: 'desc',
		},
		select: {
			sku: true,
		},
	});

	let newNumber = 1;

	if (lastProduct) {
		const lastNumber = parseInt(lastProduct.sku.split('-')[2]);
		newNumber = lastNumber + 1;
	}

	const paddedNumber = newNumber.toString().padStart(4, '0');
	return `${prefix}${paddedNumber}`;
}
