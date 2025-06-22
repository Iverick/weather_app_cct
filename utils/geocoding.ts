export interface GeoLocation {
  latitude: number;
  longitude: number;
  name: string;
  admin1: string;
  country: string;
}

/*
 * This method queries a geocoding-api endpoint to get geolocation data for a city string parameter
 */
export async function fetchCityCoordinates(city: string): Promise<GeoLocation> {
  // TODO: &count=1 tells to fetch only one city instance - where are multiple of them actually
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  const response = await fetch(geocodingUrl);
  const data = await response.json();

  if (!data.results || !data.results.length) {
    throw new Error("City not found.");
  }

  // Get required values from the response data and return them
  console.log("geocoding fetched data");
  console.log(data);

  const { latitude, longitude, country, admin1, name } = data.results[0];

  return { latitude, longitude, country, admin1, name };
}

export async function fetchCitiesList(queryCity: string): Promise<GeoLocation[]> {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(queryCity)}&count=6`;
  const response = await fetch(geocodingUrl);
  const data = await response.json();

  return (data.results ?? []).map((r: any) => ({
    name: r.name,
    admin1: r.admin1,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}
