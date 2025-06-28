import { getWeatherCondition } from "@/utils/weatherIcons";

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

export function getWeatherColor(weatherCode: number): string {
  const key = getWeatherCondition(weatherCode);
  return weatherIconColors[key] ?? weatherIconColors.unknown;
}
