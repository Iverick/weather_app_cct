import React from 'react';
import { render } from '@testing-library/react-native';
import AirQualityCard, { getAqiCategory, getAqiColor } from '@/components/AirQualityCard';
import { AirQualityData } from '@/hooks/useWeather';

const SAMPLE_DATA: AirQualityData = {
  latitude: 38,
  longitude: 23.7,
  generationtime_ms: 0,
  utc_offset_seconds: 0,
  timezone: 'GMT',
  timezone_abbreviation: 'GMT',
  elevation: 92,
  hourly: {
    time: [
      '2025-07-04T00:00',
      '2025-07-04T12:00',
      '2025-07-04T18:00'
    ],
    european_aqi: [ 30,  80, 120 ],
    pm2_5:         [  5,  10,  15 ],
    pm10:          [ 10,  20,  30 ],
    carbon_monoxide:  [0,0,0],
    nitrogen_dioxide: [0,0,0],
    sulphur_dioxide:  [0,0,0],
    ozone:            [0,0,0],
  }
};

describe('<AirQualityCard />', () => {
  it('renders AQI value and color circles', () => {
     // Force local time to match our midday reading (80)
    jest.useFakeTimers('modern').setSystemTime(new Date('2025-07-04T12:15:00Z').getTime());

    const { getByText, getAllByTestId } = render(
      <AirQualityCard data={SAMPLE_DATA} />
    );

    const expectedColor = getAqiColor(80);
    const expectedCategory = getAqiCategory(80);

    // AQI label and value
    expect(getByText('AQI')).toBeTruthy();
    expect(getByText('80')).toBeTruthy();

    // There should be a colored AQI circle
    const circles = getAllByTestId('aq-circle');
    expect(circles).toHaveLength(1);
    expect(circles[0]).toHaveStyle({ backgroundColor: expectedColor });
    expect(getByText(expectedCategory)).toBeTruthy();
  });
});
