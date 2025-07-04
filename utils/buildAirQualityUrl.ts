import { OPEN_METEO_BASE_URL } from '@/constants/api';

const AIR_QUALITY_BASE  = `https://air-quality-api.open-meteo.com/v1/air-quality`;

export function buildAirQualityUrl(lat: number, lon: number, timezone = 'auto') {
  const vars = [
    'pm2_5',
    'pm10',
    'carbon_monoxide',
    'nitrogen_dioxide',
    'sulphur_dioxide',
    'ozone',
    'european_aqi',
  ].join(',');

  return `${AIR_QUALITY_BASE}` +
         `?latitude=${lat.toFixed(4)}` +
         `&longitude=${lon.toFixed(4)}` +
         `&forecast_days=1` +
         `&hourly=${vars}` +
         `&timezone=${encodeURIComponent(timezone)}`;
}