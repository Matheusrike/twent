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
	postcode?: string;
}

export async function validateLocation(input: LocationInput) {
	try {
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
		if (input.postcode) params.append('postalcode', input.postcode);

		const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

		const res = await fetch(url, {
			headers: { 'User-Agent': 'my-app' },
		});

		if (!res.ok) {
			// TODO: needs to return appropriate error
			return;
		}
		const data: NominatimResult[] = await res.json();
		if (data.length === 0) {
			// TODO: needs to return appropriate error
			return;
		}

		const addr = data[0].address;
		return {
			country: addr.country || null,
			state: addr.state || null,
			city: addr.city || addr.town || addr.village || null,
			district: addr.suburb || addr.neighbourhood || null,
			road: addr.road || null,
			postcode: addr.postcode || null,
			lat: data[0].lat,
			lon: data[0].lon,
		};
	} catch (error) {
        // TODO: needs to return appropriate error
		return error;
	}
}
