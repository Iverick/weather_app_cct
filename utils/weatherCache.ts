import { WeatherData } from "@/hooks/useWeather";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "weather_cache";
const LAST_QUERY_KEY = 'weather:last_query';

type CacheEntry<T> = {
  timestamp: number;
  data: T;
}

/**
 * Try to load a cached weather data. 
 */
export async function getCached<T>(key: string): Promise<T | null> {
  console.log("17. weatherCache. Retrieving cached weather data for key: " + key);

  try {
    const rawData = await AsyncStorage.getItem(PREFIX + key);
    if (!rawData) return null;
    const entry = JSON.parse(rawData) as CacheEntry<T>;
    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Cache data under the given key with a timestamp.
 */
export async function setCached<T>(key: string, data: T): Promise<void> {
  console.log("40. weatherCache. Caching weather data: ");
  console.log(data);
  const entry: CacheEntry<T> = { timestamp: Date.now(), data };
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(entry)); 
}

/**
 * Save the weather result under the last query key
 */

export async function saveLastQuery(data: WeatherData) {
  await setCached(LAST_QUERY_KEY, data);
}

/**
 * Load weather result (or null if missing/expired)
 */
export async function getLastQuery(): Promise<WeatherData | null> {
  return getCached<WeatherData>(LAST_QUERY_KEY);
}
