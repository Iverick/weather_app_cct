import { createContext, useContext, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import { WeatherContext } from '@/providers/WeatherProvider';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { fetchCityCoordinates, formatLocation } from '@/utils/geocoding';
import { getCached, setCached, getLastQuery, saveLastQuery } from '@/utils/weatherCache';
import { buildWeatherUrl, buildAirQualityUrl } from '@/utils/buildWeatherUrl';
import { getLastValueBefore } from '@/utils/weatherUtils';

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

export interface CityLocation {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface AirQualityData {
  latitude:             number;
  longitude:            number;
  generationtime_ms:    number;
  utc_offset_seconds:   number;
  timezone:             string;
  timezone_abbreviation:string;
  elevation:            number;
  hourly:               AirQualityHourly;
}

/**  
 * Mirrors the `hourly` block returned by Open-Meteo’s Air Quality API
 */
export interface AirQualityHourly {
  time:             string[];
  pm10:             number[];
  pm2_5:            number[];
  carbon_monoxide:  number[];
  nitrogen_dioxide: number[];
  sulphur_dioxide:  number[];
  ozone:            number[];
  european_aqi:     number[];
}

type Source = 'city' | 'location' | null;
export function useWeatherHook() {
  const [city, setCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<CityLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useFahrenheit, setUseFahrenheit] = useState(false);
  const [lastFetchSource, setLastFetchSource] = useState<Source>(null);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);

  const { history, addToHistory, clearHistory } = useSearchHistory();

  // Subscribe to connectivity changes
  useEffect(() => {
    const sub = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });
    return () => sub();
  }, []);

  /**
   * On mount, if nothing in state, try to load last query
   */ 
  useEffect(() => {
    (async () => {
      if (!weather) {
        setLoading(true);
        const last = await getLastQuery();
        if (last) {
          // Set timeout here for smoother UX on initial page load
          setTimeout(() => {
            setWeather(last)
          }, 1000);
        }
        setLoading(false);
      }
    })();
  }, []);

  // Use effect hook to automatically refetch weather data if the unit system switch was toggled
  useEffect(() => {
    if (!weather) return;

    // Allows to properly refetch weather data in fahrenheit units for the last search location
    if (lastFetchSource === 'city') {
      handleSearch();
    } else if (lastFetchSource === 'location') {
      handleUseLocation(true);
    }
  }, [useFahrenheit]);

  /*
   * Search weather for typed city value
   */
  const handleSearch = async () => {
    // Notify the user if his device is offline
    if (!isConnected) {
      setError("No network connection.");
      setLoading(false);
      return;
    }
    if (!selectedLocation && !city.trim()) {
      setError("Please select a city first.");
      return;
    }

    let location = selectedLocation;

    // No location set - user tries to force weather query for the city fetches from the history list
    // then it will try to get coordinates for the city
    if (!location) {
      // Parse city string into a proper format required by the geocoding API
      const cityParts = city.split(",").map(s => s.trim());
      const first = cityParts[0];
      const last = cityParts[cityParts.length - 1];
      const queryCity = `${first}, ${last}`;

      // Query geocoding API
      const res = await fetchCityCoordinates(queryCity);

      location = {
        name: res.name,
        country: res.country,
        admin1: res.admin1,
        latitude: res.latitude,
        longitude: res.longitude,
      };

      setSelectedLocation(location);
    }

    // **Guard** one more time, just in case
    if (!location) {
      setError('Failed to determine location.');
      return;
    }

    const { name, admin1, country, latitude, longitude } = location;
    const label = formatLocation(name, admin1, country);

    await fetchWeather(latitude, longitude, label);
    // After the fetching data, push city to the AsyncStorage history vault
    addToHistory(label);
  };

  /*
   * Search weather for the city selected from the searched cities dropdown menu
   */
  const handleSelectHistory = async (searchedCity: string) => {
    // Try to get from cache
    await fetchCachedWeather(searchedCity);
  }

  /*
   * Fetch weather for the device location
   */
  const handleUseLocation = async (forceCall: boolean = false) => {
    // If user wants to enforce an API call, check the device is online
    if (!isConnected && forceCall) {
      setError("No network connection.");
      setLoading(false);
      return;
    }

    await fetchWeatherForCurrentLocation(forceCall);
  };

  /**
   * Fetch weather by coordinates and a display label.
   * @param latitude
   * @param longitude
   * @param label   e.g. "Dublin, Leinster, Ireland"
   */
  const fetchWeather = async (
    latitude: number,
    longitude: number,
    label: string,
  ) => {
    setLoading(true);
    setWeather(null);
    setAirQuality(null);
    setError(null);
    setLastFetchSource('city');

    console.log("68. useWeather. fetching weather for: ")
    console.log(label)

    try {
      // First, try to fetch a cached weather data for the city from the storage
      const cacheKey = `city:${label.toLowerCase()}`;

      await fetchAndParseWeather(latitude, longitude, `${label}`, cacheKey);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Try to load weather data from cache by label. 
   * If found, set state and return true; otherwise return false.
   * @param label  e.g. "Dublin, Leinster, Ireland"
   */
  const fetchCachedWeather = async (label: string): Promise<boolean> => {
    setLastFetchSource('city');
    setCity(label);
    setError("");
    setAirQuality(null);
    setError(null);

    const cacheKey = `city:${label.toLowerCase()}`;
    const cachedWeather = await getCached<WeatherData>(cacheKey);
    
    console.log("93. fetchCachedWeather. Fetched cached weather data");
    console.log(cachedWeather);

    if (cachedWeather) {
      setWeather(cachedWeather);
      return true;
    }
    return false;
  }
  
  /*
   * Method fetches weather data for the device coordinates
   */
  const fetchWeatherForCurrentLocation = async (forceCall: boolean) => {
    setCity("");
    setLoading(true);
    setWeather(null);
    setAirQuality(null);
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
      if (!forceCall) {
        const cached = await getCached<WeatherData>(cacheKey);
        if (cached) {
          console.log("122. useWeather. fetching weather data from cache");
          setWeather(cached);
          return;
        }
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

  /*
   * Helper function that queries and Open Meteo API endpoint, parses response data
   * and populates weather state object with proper values
   */
  async function fetchAndParseWeather(latitude: number, longitude: number, label: string, cacheKey: string) {
    // Create an API URL and query it to get weatherData response
    console.log("240. useWeather. fetchAndParseWeather called");
    const url = buildWeatherUrl({ latitude, longitude, useFahrenheit });
    const weatherRes = await fetch(url);
    const weatherData = await weatherRes.json();
    console.log("244. useWeather. weatherData fetched from API");
    console.log(weatherData);

    // Humidity returned in a separate object, that contains 2 arrays of time and humidity values
    // It requires to compare current time value with hourlyTimes to get a required index for both array
    const currentTime = weatherData.current_weather.time;
    const humidity =
      getLastValueBefore(
        weatherData.hourly.time,
        weatherData.hourly.relative_humidity_2m,
        currentTime
      ) ?? weatherData.hourly.relative_humidity_2m[0];

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
    // Fetch air quality data
    await fetchAirQuality(latitude, longitude);
    // Cache weather data
    await setCached(cacheKey, result);
    await saveLastQuery(result);
  }

  /**
   * Fetch air quality data for the given coordinates and set it to airQuality state.
   * @param latitude
   * @param longitude
   */
  async function fetchAirQuality(latitude: number, longitude: number) {
    const url = buildAirQualityUrl(latitude, longitude);
    const res = await fetch(url)
    const data = (await res.json()) as AirQualityData;
    setAirQuality(data);
  }

  return {
    weather,
    airQuality,
    city,
    setCity,
    loading,
    error,
    setError,
    fetchWeather,
    fetchCachedWeather,
    fetchWeatherForCurrentLocation,
    useFahrenheit,
    setUseFahrenheit,
    lastFetchSource,
    selectedLocation,
    setSelectedLocation,
    isConnected,
    setLoading,
    history,
    addToHistory,
    clearHistory,
    handleSearch,
    handleSelectHistory,
    handleUseLocation,
  };
}

// Consume hook with WeatherContext
export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used inside a WeatherProvider');
  }
  return context;
}
