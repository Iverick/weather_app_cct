// Maps provided code value to code icon string
export function getWeatherIconName(code: number): any {
  if (code === 0) return 'weather-sunny';
  if (code >= 1 && code <= 3) return 'weather-partly-cloudy';
  if (code >= 45 && code <= 48) return 'weather-fog';
  if (code >= 51 && code <= 67) return 'weather-rainy';
  if (code >= 71 && code <= 77) return 'weather-snowy';
  if (code >= 80 && code <= 82) return 'weather-pouring';
  if (code >= 95 && code <= 99) return 'weather-lightning';
  return 'weather-cloudy';
}