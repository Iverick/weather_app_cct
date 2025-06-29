import { getWeatherColor, getWeatherCondition, getWeatherIconName, weatherIconColors } from "@/utils/weatherCondition";

describe("weatherCondition", () => {
  test("maps code 0 → sunny", () => {
    expect(getWeatherCondition(0)).toBe("sunny");
    expect(getWeatherIconName(0)).toBe("weather-sunny");
    expect(getWeatherColor(0)).toBe(weatherIconColors.sunny);
  });
  
  test('maps code 80 → pouring', () => {
    expect(getWeatherCondition(80)).toBe("pouring");
    expect(getWeatherIconName(80)).toBe("weather-pouring");
    expect(getWeatherColor(80)).toBe(weatherIconColors.pouring);
  });
});
