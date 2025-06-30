import { renderHook, act } from '@testing-library/react-hooks';
import { useWeather } from '@/hooks/useWeather';
import * as cacheModule from '@/utils/weatherCache';
import { setCached } from '@/utils/weatherCache';

// Mock NetInfo network connection so we can control isConnected
import NetInfo from '@react-native-community/netinfo';
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(cb => {
    // call immediately with “connected”
    cb({ isConnected: true });
    return () => {};
  }),
}));

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: { latitude: 51.5, longitude: -0.1 }
  }),
}));

// Mock utilities
import * as geo from '../utils/geocoding';
import * as cache from '../utils/weatherCache';
import * as urlBuilder from '../utils/buildWeatherUrl';

jest.spyOn(geo, 'fetchCityCoordinates').mockResolvedValue([
  { name: 'Test City', country: 'TC', latitude: 51, longitude: -0.1 }
]);

// Mock the network fetch
global.fetch = jest.fn().mockResolvedValue({
  json: async () => ({
    current_weather: { temperature: 10, windspeed: 5, weathercode: 0, time: '2025-07-10T10:00' },
    hourly: {
      time: ['2025-07-10T09:00','2025-07-10T10:00'],
      relative_humidity_2m: [50,60]
    },
    daily: {
      time: ['2025-07-11'],
      temperature_2m_max: [15],
      temperature_2m_min: [5],
      weather_code: [1]
    }
  })
} as any);

describe('useWeather hook', () => {
  it('starts with the correct defaults', () => {
    const { result } = renderHook(() => useWeather());
    const {
      city, selectedLocation, loading, weather,
      error, useFahrenheit, isConnected
    } = result.current;

    expect(city).toBe('');
    expect(selectedLocation).toBeNull();
    expect(loading).toBe(false);
    expect(weather).toBeNull();
    expect(error).toBeNull();
    expect(useFahrenheit).toBe(false);
    expect(isConnected).toBe(true);
  });

  it('fetchCachedWeather sets weather from cache and returns true', async () => {
    const fakeWeather = {
      location: 'X',
      temperature: 1,
      windspeed: 1,
      weathercode: 0,
      humidity: 1,
      currentTime: '',
      forecast:[]
    };
    // Mock the cache to return a fake weather object
    jest.spyOn(cacheModule, 'getCached').mockResolvedValueOnce(fakeWeather);

    const { result, waitFor } = renderHook(() => useWeather());

    let hit: boolean = false;
    // Call fetchCachedWeather and await its completion
    await act(async () => {
      hit = await result.current.fetchCachedWeather('X');
    });

    await waitFor(() => {
      expect(hit).toBe(true);
      expect(result.current.weather).toEqual(fakeWeather);
    });
  });

  it('fetchWeather (city) populates weather via network and caches it', async () => {
    const { result } = renderHook(() => useWeather());

    // Call fetchWeather and await its completion
    await act(async () => {
      await result.current.fetchWeather(
        51, 
        -0.1, 
        'Testville, TC'
      );
    });

    // Check that the weather was fetched and set correctly
    expect(result.current.weather).not.toBeNull();
    expect(setCached).toHaveBeenCalled();  
  });

  it('loads from cache when offline', async () => {
    jest
      .spyOn(NetInfo, 'addEventListener')
      .mockImplementationOnce(cb => {
        cb({ isConnected: false });
        return () => {};
      });

    // Stub getLastCacheKey → some key, and getCached → fake data
    jest.spyOn(cacheModule, 'getLastCacheKey').mockResolvedValueOnce('coords:foo');
    const fakeWeather = {
      location: 'LC',
      temperature: 2,
      windspeed: 2,
      weathercode: 0,
      humidity: 2,
      currentTime: '',
      forecast: [],
    };
    jest.spyOn(cacheModule, 'getCached').mockResolvedValueOnce(fakeWeather);

    const { result } = renderHook(() => useWeather());

    // Call fetchWeatherForCurrentLocation
    await act(async () => {
      await result.current.fetchWeatherForCurrentLocation();
    });

    // Check that the weather was loaded from cache
    expect(result.current.weather).toEqual(fakeWeather);
    expect(result.current.error).toBe(null);
  });
});
