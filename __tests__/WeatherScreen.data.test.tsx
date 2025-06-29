import React from 'react';
import { render } from '@testing-library/react-native';
import WeatherScreen from '@/app/index';

jest.mock('@/hooks/useWeather', () => ({
  useWeather: () => ({
    city: 'Testville',
    setCity: jest.fn(),
    weather: {
      location: 'Testville',
      temperature: 20,
      windspeed: 5,
      weathercode: 0,
      humidity: 50,
      currentTime: '2025-07-10T10:00',
      forecast: [
        { date: '2025-07-11', max: 25, min: 15, code: 1 },
      ],
    },
    loading: false,
    error: null,
    useFahrenheit: false,
    setUseFahrenheit: jest.fn(),
    selectedLocation: { name: 'Testville', country: 'Country', latitude: 0, longitude: 0 },
    setSelectedLocation: jest.fn(),
    isConnected: true,
    lastFetchSource: null,
    fetchWeather: jest.fn(),
    fetchWeatherForCurrentLocation: jest.fn(),
  }),
}));

describe('<WeatherScreen /> weather data', () => {
  test('renders CurrentWeather and ForecastList when weather is present', () => {
    const { getByText } = render(<WeatherScreen />);

    // From CurrentWeather
    expect(getByText(/Testville/)).toBeTruthy();
    expect(getByText(/20°C/)).toBeTruthy();

    // From ForecastList (weekday or day)
    expect(getByText(/25°C/)).toBeTruthy();
    expect(getByText(/15°C/)).toBeTruthy();
  });
});
