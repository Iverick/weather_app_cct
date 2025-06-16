import { useState } from 'react';
import { Alert } from 'react-native';

export interface ForecastDay {
  date: string;
  min: number;
  max: number;
  code: number;
}

export interface WeatherData {
  location: string;
  temperature: number;
  windspeed: number;
  weathercode: number;
  humidity: number;
  currentTime: string;
  forecast: ForecastDay[];
}

export function useWeather() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null)
  
  const fetchWeather = async () => {
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter a city name.');
      return;
    }

    setLoading(true);
    setWeather(null);
    setError(null);

    try {
      // First, I need to fetch coordinates for User's city input
      const geoCoords = await fetch(
        // TODO: &count=1 tells to fetch only one city instance - where are multiple of them actually!
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      )
      const geoData = await geoCoords.json();

      if (!geoData.results || !geoData.results.length) {
        throw new Error('City not found.');
      }

      const { latitude, longitude, country, name } = geoData.results[0];

      // Then, I can query open meteo API and get weather data
      const weatherRes = await fetch(
        // latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m - to get current weather
        // &daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=5&timezone=auto - forecast
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=5&timezone=auto`
      );

      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather) {
        throw new Error('Weather data unavailable.');
      }

      console.log("weatherData");
      console.log(weatherData);
      // Populate weather component state with the data fetched from the APIs

      // Humidity returned in a separate object, that contains 2 arrays of time and humidity values
      // Current time index can be used as a key to map them together
      const currentTime = new Date(weatherData.current_weather.time);
      const hourlyTimes = weatherData.hourly.time.map((t: string) => new Date(t));
      let closestIndex = 0;

      // Loop through hourly times array until we get index of the closest to the current time value
      for (let i = 0; i < hourlyTimes.length; i++) {
        const hourlyTime = hourlyTimes[i];

        if (hourlyTime <= currentTime) {
          closestIndex = i;
        } else {
          break;
        }
      }
      const humidity = weatherData.hourly.relative_humidity_2m[closestIndex];

      console.log("daily");
      console.log(weatherData.daily);

      const forecast: ForecastDay[] = weatherData.daily.time.map((
        date: string, index: number) => ({
          date,
          min: weatherData.daily.temperature_2m_min[index],
          max: weatherData.daily.temperature_2m_max[index],
          code: weatherData.daily.weather_code[index],
        })
      );

      setWeather({
        location: `${name}, ${country}`,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        weathercode: weatherData.current_weather.weathercode,
        currentTime: weatherData.current_weather.time,
        humidity,
        forecast,
      })
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return { weather, city, setCity, loading, error, fetchWeather };
}
