import { AppError } from "@/utils/errors.util";

export async function getCoordinates(country: string, city: string, street: string) {
	const query = `${street}, ${city}, ${country}`;
	const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(
		query,
	)}`;

	const response = await fetch(url, {
		headers: {
			'User-Agent': 'SeuApp/1.0 (email@exemplo.com)',
		},
	});

	if (!response.ok) {
		throw new AppError({
			message: 'Erro ao consultar serviço de geocodificação',
			errorCode: 'GEOCODING_FAILED',
		});
	}

	const data = await response.json();

	if (!data.length) {
		throw new AppError({
			message: 'Endereço não encontrado',
			errorCode: 'INVALID_ADDRESS',
		});
	}

	return {
		lat: Number(data[0].lat),
		lon: Number(data[0].lon),
	};
}
