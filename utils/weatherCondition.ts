/**
 * Turns an Open-Meteo weather code into a simple condition key.
 */
export function getWeatherCondition(code: number): string {
  if (code === 0) return "sunny";
  if (code >= 1 && code <= 3) return "partly-cloudy";
  if (code >= 45 && code <= 48) return "fog";
  if (code >= 51 && code <= 67) return "rainy";
  if (code >= 71 && code <= 77) return "snowy";
  if (code >= 80 && code <= 82) return "pouring";
  if (code >= 95 && code <= 99) return "lightning";
  return "cloudy";
}

/**
 * Maps provided code value to code icon string
 */
export function getWeatherIconName(code: number): any {
  const condition = getWeatherCondition(code);
  console.log("getWeatherIconName: ", condition);
  return `weather-${condition}`;
}

export const weatherIconColors: Record<string, string> = {
  sunny: "#FDB813",
  "partly-cloudy": "#D7DB58",
  fog: "#B0BEC5",
  rainy: "#546ab3",
  snowy: "#81D4FA",
  pouring: "#0288D1",
  lightning: "#FF6D00",
  cloudy: "#78909C",
};

/**
 * Maps provided weatherCode value to the corresponding color string
 */
export function getWeatherColor(weatherCode: number): string {
  const key = getWeatherCondition(weatherCode);
  return weatherIconColors[key] ?? weatherIconColors.unknown;
}
