import prisma from '@prisma/client';
import countries from 'i18n-iso-countries';

export async function generateStoreCode(countryInAlpha2: string) {
	const alpha2 = countryInAlpha2.toUpperCase();
	const alpha3 = countries.alpha2ToAlpha3(alpha2);

	const lastStoreCode = await prisma.store.findFirst({
		where: {
			code: { startsWith: alpha3 },
		},
		orderBy: {
			code: 'desc',
		},
	});

	const nextNumber = lastStoreCode
		? parseInt(lastStoreCode.code.slice(3), 10) + 1
		: 1;

	return `${alpha3}${nextNumber.toString().padStart(3, '0')}`;
}
