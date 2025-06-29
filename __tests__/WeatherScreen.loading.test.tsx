import React from 'react';
import { render } from '@testing-library/react-native';
import WeatherScreen from '@/components/WeatherScreen';
import * as useWeatherHook from '@/hooks/useWeather';

const defaultHook = {
  city: '',
  setCity: jest.fn(),
  weather: null,
  loading: false,
  error: null,
  useFahrenheit: false,
  setUseFahrenheit: jest.fn(),
  selectedLocation: null,
  setSelectedLocation: jest.fn(),
  isConnected: true,
  lastFetchSource: null,
  fetchWeather: jest.fn(),
  fetchWeatherForCurrentLocation: jest.fn(),
};

describe('<WeatherScreen /> loading indicator', () => {
  afterEach(() => jest.resetAllMocks());

  it('does NOT render the ActivityIndicator when loading=false', () => {
    jest.spyOn(useWeatherHook, 'useWeather').mockReturnValue({
      ...defaultHook,
      loading: false,
    });

    const { queryByTestId  } = render(<WeatherScreen />);
    expect(queryByTestId ('loading-indicator')).toBeNull();
  });

  it('renders the ActivityIndicator when loading=true', () => {
    jest.spyOn(useWeatherHook, 'useWeather').mockReturnValue({
      ...defaultHook,
      loading: true,
    });

    const { getByTestId } = render(<WeatherScreen />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});

