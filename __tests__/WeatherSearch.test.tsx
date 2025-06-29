import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import WeatherSearch from '../components/WeatherSearch';

describe('<WeatherSearch />', () => {
  it('calls onSubmit when “Search” is pressed', () => {
    const onSubmit = jest.fn();
    const setCity = jest.fn();
    
    const { getByText, getByTestId } = render(
      <WeatherSearch
        city="Paris"
        setCity={setCity}
        onSubmit={onSubmit}
        history={[]}
        onSelectHistory={() => {}}
        clearHistory={() => {}}
        isFocused={false}
        setIsFocused={() => {}}
      />
    );

    // Simultate clicking the search button
    fireEvent.press(getByTestId('search-button'));
    expect(onSubmit).toHaveBeenCalled();
  });
  
  it('shows history items when focused & city.length < 3', () => {
    const onSelectHistory = jest.fn();
    const clearHistory = jest.fn();

    const { getByPlaceholderText, getByText } = render(
      <WeatherSearch
        city=""
        setCity={() => {}}
        onSubmit={() => {}}
        history={['Dublin', 'Basel']}
        onSelectHistory={onSelectHistory}
        clearHistory={clearHistory}
        isFocused={true}
        setSelectedLocation={() => {}}
        setIsFocused={() => {}}
      />
    );

    // Simulate focusing the input
    const input = getByPlaceholderText('Enter city');
    fireEvent(input, 'focus');

    // focusing input would show the dropdown
    expect(getByText('Dublin')).toBeTruthy();
    expect(getByText('Basel')).toBeTruthy();
  });
})
