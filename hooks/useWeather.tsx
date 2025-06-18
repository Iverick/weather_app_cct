import { useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { buildWeatherUrl } from '@/utils/buildWeatherUrl';
import { fetchCityCoordinates } from '@/utils/geocoding';

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
  
  /*
   * Method fetches weather data for the set city value
   */
  const fetchWeather = async () => {
    setLoading(true);
    setWeather(null);
    setError(null);

    try {
      if (!city.trim()) {
        throw new Error("Please enter a city name.");
      }

      // Use helper method to get geo data for the provided city string
      const { latitude, longitude, name, country } = await fetchCityCoordinates(city);

      await fetchAndParseWeather(latitude, longitude, `${name}, ${country}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  
  /*
   * Method fetches weather data for the device coordinates
   */
  const fetchWeatherForCurrentLocation = async () => {
    setCity("");
    setLoading(true);
    setWeather(null);
    setError(null);

    try {
      // Get location permission access
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission to access location was denied");
      }

      // Get devices coordinates with expo-location method
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      await fetchAndParseWeather(latitude, longitude, "Current location");
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

  /*
   * Helper function that queries and Open Meteo API endpoint, parses response data
   * and populates weather state object with proper values
   */
  async function fetchAndParseWeather (latitude: number, longitude: number, label: string) {
    // Create an API URL and query it to get weatherData response
    const url = buildWeatherUrl({ latitude, longitude, useFahrenheit });
    const weatherRes = await fetch(url);
    const weatherData = await weatherRes.json();
    console.log(weatherData);

    // Humidity returned in a separate object, that contains 2 arrays of time and humidity values
    // It requires to compare current time value with hourlyTimes to get a required index for both array
    const currentTime = weatherData.current_weather.time;
    const hourlyTimes = weatherData.hourly.time.map((t: string) => new Date(t));
    const currentDate = new Date(currentTime);
    let humidity = 0;

    // Loop through hourly times array until we get index of the closest to the current time value
    for (let i = 0; i < hourlyTimes.length; i++) {
      if (hourlyTimes[i] <= currentDate) humidity = weatherData.hourly.relative_humidity_2m[i];
      else break;
    }

     // Get weather forecast data from a dedicated array inside weatherData
    const forecast = weatherData.daily.time.map((date: string, i: number) => ({
      date,
      min: weatherData.daily.temperature_2m_min[i],
      max: weatherData.daily.temperature_2m_max[i],
      code: weatherData.daily.weather_code[i],
    }));

    // Populate weather component state with the data fetched from the APIs
    setWeather({
      location: label,
      temperature: weatherData.current_weather.temperature,
      windspeed: weatherData.current_weather.windspeed,
      weathercode: weatherData.current_weather.weathercode,
      humidity,
      currentTime,
      forecast,
    });
  }
}
