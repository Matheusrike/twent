import { AppError } from "../utils/errors.util.ts";

interface NominatimResult {
	address: {
		country?: string;
		state?: string;
		city?: string;
		town?: string;
		village?: string;
		suburb?: string;
		neighbourhood?: string;
		road?: string;
		postcode?: string;
	};
	lat: string;
	lon: string;
}

export interface LocationInput {
	road?: string;
	district?: string;
	city?: string;
	state?: string;
	country?: string;
	zip_code?: string;
}

function normalize(s?: string): string {
	if (!s) return '';
	return s
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // remove diacríticos
		.replace(/\s+/g, ' ');
}

export async function validateLocation(input: LocationInput): Promise<boolean> {
	// validar entrada
	const providedKeys = Object.entries(input).filter(
		([, v]) => v && String(v).trim() !== '',
	);
	if (providedKeys.length === 0) {
		throw new AppError({
			message: 'Nenhum campo de localização fornecido',
			errorCode: 'BAD_REQUEST',
		});
	}

	const params = new URLSearchParams({
		format: 'json',
		addressdetails: '1',
		limit: '1',
	});

	if (input.road) params.append('street', input.road);
	if (input.district) params.append('suburb', input.district);
	if (input.city) params.append('city', input.city);
	if (input.state) params.append('state', input.state);
	if (input.country) params.append('country', input.country);
	if (input.zip_code) params.append('postalcode', input.zip_code);

	const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

	// timeout (5s)
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 5000);

	try {
		const res = await fetch(url, {
			headers: {
				'Accept-Language': 'pt-BR,pt;q=0.9',
			},
			signal: controller.signal,
		});
		clearTimeout(timeout);

		if (!res.ok) {
			throw new AppError({
				message: 'Erro ao consultar serviço de geocoding',
				errorCode: 'BAD_GATEWAY',
			});
		}

		const data = (await res.json()) as NominatimResult[];
		if (!Array.isArray(data) || data.length === 0) {
			throw new AppError({
				message: 'Localização não encontrada',
				errorCode: 'NOT_FOUND',
			});
		}

		const addr = data[0].address;

		// mapping de campos retornados por Nominatim
		const fieldChecks: [keyof LocationInput, string[]][] = [
			['road', [addr.road ?? '']],
			['district', [addr.suburb ?? '', addr.neighbourhood ?? '']],
			['city', [addr.city ?? '', addr.town ?? '', addr.village ?? '']],
			['state', [addr.state ?? '']],
			['country', [addr.country ?? '']],
			['zip_code', [addr.postcode ?? '']],
		];

		const mismatches: string[] = [];

		for (const [inputKey, addrCandidates] of fieldChecks) {
			const inputValue = input[inputKey];
			if (!inputValue) continue; 

			const normInput = normalize(String(inputValue));
			const normCandidates = addrCandidates
				.map(normalize)
				.filter(Boolean);

			if (inputKey === 'zip_code') {
				const ok = normCandidates.some(
					(c) =>
						c === normInput ||
						c.startsWith(normInput) ||
						normInput.startsWith(c),
				);
				if (!ok) mismatches.push('postcode');
				continue;
			}

			const ok = normCandidates.some(
				(candidate) =>
					candidate.includes(normInput) ||
					normInput.includes(candidate),
			);
			if (!ok) mismatches.push(String(inputKey));
		}

		if (mismatches.length > 0) {
			throw new AppError({
				message: `Falha na validação de localização nos campos: ${mismatches.join(', ')}`,
				errorCode: 'BAD_REQUEST',
			});
		}

		return true;
	} catch (err) {
		if (err.name === 'AbortError') {
			throw new AppError({
				message: 'Tempo esgotado ao consultar serviço de localização',
				errorCode: 'GATEWAY_TIMEOUT',
			});
		}
		if (err instanceof AppError) throw err;
		throw new AppError({
			message: 'Erro ao validar localização',
			errorCode: 'BAD_GATEWAY',
		});
	} finally {
		clearTimeout(timeout);
	}
}
