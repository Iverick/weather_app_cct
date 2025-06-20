import { useState } from 'react';
import * as Location from 'expo-location';
import { buildWeatherUrl } from '@/utils/buildWeatherUrl';
import { fetchCityCoordinates } from '@/utils/geocoding';
import { getCached, setCached } from '@/utils/weatherCache';

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

type Source = 'city' | 'location' | null;

export function useWeather() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useFahrenheit, setUseFahrenheit] = useState(false);
  const [lastFetchSource, setLastFetchSource] = useState<Source>(null);

  /*
   * Method fetches weather data for the set city value
   */
  const fetchWeather = async (forceAPICall: boolean = false, overrideCity?: string) => {
    setLoading(true);
    setWeather(null);
    setError(null);
    setLastFetchSource('city');

    console.log("forced to fetch from API: ")
    console.log(forceAPICall)

    try {
      const queryCity = overrideCity ?? city;

      console.log("city string value inside useWeather: ")
      console.log(queryCity)

      if (!queryCity.trim()) {
        throw new Error("Please enter a city name.");
      }
      
      // First, try to fetch a cached weather data for the city from the storage
      // TODO: perhaps cacheKey should be more unique and include coordinates
      const cacheKey = `city:${queryCity.trim().toLowerCase()}`;
      if (!forceAPICall) {
        const cachedWeather = await getCached<WeatherData>(cacheKey);
        if (cachedWeather) {
          // If weather found in cache, set cached weather data and early terminate the function execution
          setWeather(cachedWeather);
          return;
        }
      }

      // Use helper method to get geo data for the provided city string
      const { latitude, longitude, name, country } = await fetchCityCoordinates(queryCity);

      await fetchAndParseWeather(latitude, longitude, `${name}, ${country}`, cacheKey);
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
    setLastFetchSource('location');

    try {
      // Get location permission access
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Permission to access location was denied");
      }

      // Get devices coordinates with expo-location method
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Try to fetch a cached weather data for the device location from the storage
      const cacheKey = `coords:${latitude.toFixed(4)},${longitude.toFixed(4)}`;
      const cached = await getCached<WeatherData>(cacheKey);
      if (cached) {
        setWeather(cached);
        return;
      }

      // TODO: Ideally I would have to get a city name using device coords
      //       instead of putting "Current location" string.
      //       Requires too much hustle to get it done at this point though.
      await fetchAndParseWeather(latitude, longitude, "Current location", cacheKey);
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
    lastFetchSource,
  };

  /*
   * Helper function that queries and Open Meteo API endpoint, parses response data
   * and populates weather state object with proper values
   */
  async function fetchAndParseWeather (latitude: number, longitude: number, label: string, cacheKey: string) {
    // Create an API URL and query it to get weatherData response
    const url = buildWeatherUrl({ latitude, longitude, useFahrenheit });
    const weatherRes = await fetch(url);
    const weatherData = await weatherRes.json();
    console.log("143. useWeather. weatherData fetched from API");
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

    // Create result object that stores the data fetched from the APIs
    const result: WeatherData = {
      location: label,
      temperature: weatherData.current_weather.temperature,
      windspeed: weatherData.current_weather.windspeed,
      weathercode: weatherData.current_weather.weathercode,
      humidity,
      currentTime,
      forecast,
    };

    // setWeather state
    setWeather(result);
    // Cache weather data
    await setCached(cacheKey, result);
  }
}
