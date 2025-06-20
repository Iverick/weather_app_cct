import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "weather_cache";
// 24 hours in ms
// Will be used to remove old cached data
const TTL = 24 * 60 * 60 * 1000;

type CacheEntry<T> = {
  timestamp: number;
  data: T;
}

/**
 * Try to load a cached weather data. If it’s older than 24 h, remove data.
 */
export async function getCached<T>(key: string): Promise<T | null> {
  console.log("17. weatherCache. Retrieving cached weather data for key: " + key);

  try {
    const rawData = await AsyncStorage.getItem(PREFIX + key);
    if (!rawData) return null;
    const entry = JSON.parse(rawData) as CacheEntry<T>;

    if (Date.now() - entry.timestamp > TTL) {
      AsyncStorage.removeItem(PREFIX + key);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}


/**
 * Cache data under the given key with a timestamp.
 */
export async function setCached<T>(key: string, data: T): Promise<void> {
  console.log("40. weatherCache. Caching weather data: " + data);
  const entry: CacheEntry<T> = { timestamp: Date.now(), data };
  await AsyncStorage.setItem(PREFIX + key, JSON.stringify(entry)); 
}
