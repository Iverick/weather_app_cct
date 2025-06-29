import React from 'react';
import { render } from '@testing-library/react-native';
import ForecastList from '../components/ForecastList';

const mockForecast = [
  { date: '2025-07-01', max: 25, min: 15, code: 1 },
  { date: '2025-07-02', max: 28, min: 17, code: 2 },
];

describe('<ForecastList />', () => {
  it('renders one card per forecast day with correct temps', () => {
    const { getByText } = render(
      <ForecastList forecast={mockForecast} useFahrenheit={false} />
    );
    
    // Check if the forecast days are rendered correctly
    expect(getByText(/Tue/)).toBeTruthy();
    expect(getByText(/Wed/)).toBeTruthy();

    // Check max/min temperatures
    expect(getByText(/25°C/)).toBeTruthy();
    expect(getByText(/15°C/)).toBeTruthy();
    expect(getByText(/28°C/)).toBeTruthy();
    expect(getByText(/17°C/)).toBeTruthy();
  });
});
