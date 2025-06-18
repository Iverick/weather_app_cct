export interface GeoLocation {
  latitude: number;
  longitude: number;
  name: string;
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
  const { latitude, longitude, country, name } = data.results[0];

  return { latitude, longitude, name, country };
}