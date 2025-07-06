import { OPEN_METEO_BASE_URL } from '@/constants/api';

const FORECAST_API_URL = `${OPEN_METEO_BASE_URL}/forecast`;
const AIR_QUALITY_BASE  = `https://air-quality-api.open-meteo.com/v1/air-quality`;

export function buildWeatherUrl(params: {
  latitude: number;
  longitude: number;
  useFahrenheit: boolean;
}): string {
  const { latitude, longitude, useFahrenheit } = params;
  
  // This ULR part is used to fetch weather forecast array
  const forecastParams = "&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=5";
  // Used to change unit to fahrenheit
  const unitParams = useFahrenheit ? "&temperature_unit=fahrenheit&windspeed_unit=mph" : "";

  // Glue URL parts to a single string to get a final API URL
  return `${FORECAST_API_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m${forecastParams}&timezone=auto${unitParams}`;
}

export function buildAirQualityUrl(lat: number, lon: number, timezone = 'auto') {
  const vars = [
    'european_aqi',
  ].join(',');

  return `${AIR_QUALITY_BASE}` +
         `?latitude=${lat.toFixed(4)}` +
         `&longitude=${lon.toFixed(4)}` +
         `&forecast_days=1` +
         `&hourly=${vars}` +
         `&timezone=${encodeURIComponent(timezone)}`;
}