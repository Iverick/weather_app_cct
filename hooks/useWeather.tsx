import { useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { buildWeatherUrl } from '@/utils/buildWeatherUrl';

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
  const [error, setError] = useState<string | null>(null);
  const [useFahrenheit, setUseFahrenheit] = useState(false);
  
  // Method fetches weather data for required city
  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
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

      // Then, I can create an API URL and use it to query open meteo API and get weather data
      const weatherUrl = buildWeatherUrl({ latitude, longitude, useFahrenheit });
      const weatherRes = await fetch(weatherUrl);
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

      // Parse returned weatherData.daily.time array to get the weather forecast
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
  
  async function fetchWeatherForCurrentLocation() {
    setCity("");
    setLoading(true);
    setWeather(null);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission to access location was denied");
      }

      // Get devices coordinates with expo-location method
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Query API URL
      const url = buildWeatherUrl({ latitude, longitude, useFahrenheit });
      const weatherRes = await fetch(url);
      const weatherData = await weatherRes.json();
      console.log(weatherData);

      const currentTime = weatherData.current_weather.time;
      const hourlyTimes = weatherData.hourly.time.map((t: string) => new Date(t));
      const currentDate = new Date(currentTime);
      let humidity = 0;
      for (let i = 0; i < hourlyTimes.length; i++) {
        if (hourlyTimes[i] <= currentDate) humidity = weatherData.hourly.relative_humidity_2m[i];
        else break;
      }

      const forecast = weatherData.daily.time.map((date: string, i: number) => ({
        date,
        min: weatherData.daily.temperature_2m_min[i],
        max: weatherData.daily.temperature_2m_max[i],
        code: weatherData.daily.weather_code[i],
      }));

      setWeather({
        location: 'Current location',
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        weathercode: weatherData.current_weather.weathercode,
        humidity,
        currentTime,
        forecast,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    weather,
    city,
    setCity,
    loading,
    error,
    fetchWeather,
    fetchWeatherForCurrentLocation,
    useFahrenheit,
    setUseFahrenheit,
  };
}
