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
      <View style={styles.locationRow}>
        <MaterialCommunityIcons name="home-map-marker" size={25} color="#333" />
        <Text style={styles.locationText}>
          {weather.location === "Current location" ? "Current location" : weather.location}
        </Text>
      </View>
      <Text style={styles.text}>Temperature: {weather.temperature}°{useFahrenheit ? "F" : "C"}</Text>
      <Text style={styles.text}>Windspeed: {weather.windspeed} {useFahrenheit ? "mph" : "km/h"}</Text>
      <Text style={styles.text}>Humidity: {weather.humidity}%</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 6,
  },
});
