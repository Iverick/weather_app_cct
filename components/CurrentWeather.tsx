import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HomeIcon } from 'react-native-heroicons/outline';
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
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name={getWeatherIconName(weather.weathercode)}
          size={64}
          color="#333"
        />
      </View>
      <Text style={styles.text}>
        {formatCurrentTime(weather.currentTime)}
      </Text>
      <View style={styles.locationRow}>
        <HomeIcon size={24} color="#444" />
        <Text style={styles.locationText}>
          {weather.location === "Current location" ? "Current location" : weather.location}
        </Text>
      </View>
      <Text style={styles.temperature}>{weather.temperature}°{useFahrenheit ? "F" : "C"}</Text>
      <Text style={styles.details}>Windspeed: {weather.windspeed} {useFahrenheit ? "mph" : "km/h"}</Text>
      <Text style={styles.details}>Humidity: {weather.humidity}%</Text>
    </View>
  )
}

// Base text style for consistency
const baseText = {
  fontFamily: "Montserrat-Regular",
  fontSize: 16,
  marginVertical: 4,
  color: "#444",
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconWrapper: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 40,
    padding: 12,
    marginBottom: 8,
  },
  text: baseText,
  temperature: {
    fontFamily: "Montserrat-Bold",
    fontSize: 40,
    color: "#333",
  },
  details: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  locationText: {
    ...baseText,
    marginLeft: 4,
  },
});
