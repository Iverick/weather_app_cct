export function getWeatherIconName(code: number): any {
  if (code === 0) return 'weather-sunny';
  if (code >= 1 && code <= 3) return 'weather-partly-cloudy';
  if (code >= 45 && code <= 48) return 'weather-fog';
  if (code >= 51 && code <= 57) return 'weather-rainy';
  if (code >= 61 && code <= 67) return 'weather-pouring';
  if (code >= 71 && code <= 77) return 'weather-snowy';
  if (code >= 80 && code <= 82) return 'weather-showers';
  if (code >= 95 && code <= 99) return 'weather-lightning';
  return 'weather-cloudy-alert';
}