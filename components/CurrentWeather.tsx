import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WeatherData } from '../hooks/useWeather';
import { getWeatherIconName } from '../utils/weatherIcons';
import { formatCurrentTime } from '../utils/time';

interface Props {
  weather: WeatherData;
  useFahrenheit: boolean;
}

// This components is used to display current weather data
export default function CurrentWeather({ weather, useFahrenheit }: Props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={getWeatherIconName(weather.weathercode)}
        size={64}
        color="#bfbfbf"
        />
      <Text style={styles.text}>
        {formatCurrentTime(weather.currentTime)}
      </Text>
      <Text style={styles.text}>Location: {weather.location}</Text>
      <Text style={styles.text}>Temperature: {weather.temperature}°{useFahrenheit ? "F" : "C"}</Text>
      <Text style={styles.text}>Windspeed: {weather.windspeed} {useFahrenheit ? "mph" : "km/h"}</Text>
      <Text style={styles.text}>Humidity: {weather.humidity}%</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
});
