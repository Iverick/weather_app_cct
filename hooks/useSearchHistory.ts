import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Obviusly I would have to put this key into .env file
// Didn't do that to simplify the deployment process for reviewing the project
const STORAGE_KEY = 'storage_key_value';

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  // Calls loadHistory on the component mounting
  useEffect(() => {
    loadHistory();
  }, []);

  // log for debugging
  useEffect(() => { console.log(history) }, [history]);

  /*
   * Function finds AsyncStorage by STORAGE_KEY, pases output data 
   * and pushes it into a local history state variable
   */
  const loadHistory = async () => {
    const res = await AsyncStorage.getItem(STORAGE_KEY);
    if (res) setHistory(JSON.parse(res));
  }

  /*
   * Function pushes a city value into local history and AsyncStorage
   * if user didn't make a search for the city name previously
   */
  const addToHistory = async (city: string) => {
    const truncated = city.trim();
    if (!truncated || history.includes(truncated)) return;

    // Limits storage capacity to 10 items
    const updated = [truncated, ...history].slice(0, 10);
    setHistory(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  /*
   * Function clear history storage
   */
  const clearHistory = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setHistory([]);
    console.log("45. useSearchHistory. clearHistory");
    console.log(history);
    console.log(await AsyncStorage.getItem(STORAGE_KEY));
  }

  return { history, addToHistory, clearHistory };
}