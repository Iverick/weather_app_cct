import React from 'react';
import { render } from '@testing-library/react-native';
import CurrentWeather from '../components/CurrentWeather';

const mockWeather = {
  location: 'Testville',
  temperature: 22.5,
  windspeed: 10,
  weathercode: 0,
  humidity: 55,
  currentTime: new Date().toISOString(),
  forecast: [],
};

describe('<CurrentWeather />', () => {
  it('renders location, temperature, units, and humidity', () => {
    const { getByText } = render(
      <CurrentWeather weather={mockWeather} useFahrenheit={false} />
    );

    // Check if the location, temperature, windspeed, and humidity are rendered correctly
    expect(getByText('Testville')).toBeTruthy();
    expect(getByText(/22.5°C/)).toBeTruthy();
    expect(getByText(/Windspeed: 10 km\/h/)).toBeTruthy();
    expect(getByText(/Humidity: 55%/)).toBeTruthy();
  })
});
