import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getWeatherIconName } from '../utils/weatherIcons';
import { useWeather } from '@/hooks/useWeather';
import WeatherSearch from '@/components/WeatherSearch';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastList from '@/components/ForecastList';

interface WeatherData {
  currentTime: string;
  location: string;
  temperature: number;
  windspeed: number;
  weathercode: number;
  humidity: number;
  forecast: ForecastDay[];
}

interface ForecastDay {
  date: string;
  min: number;
  max: number;
  code: number;
}

export default function WeatherScreen() {
const {
    weather,
    city,
    setCity,
    loading,
    error,
    fetchWeather,
  } = useWeather();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Weather' }} />
      <Text style={styles.title}>Search Weather by City</Text>

      <WeatherSearch city={city} setCity={setCity} onSubmit={fetchWeather} />
      {loading && <ActivityIndicator size="large" />}
      {weather && 
        <View style={styles.weatherContainer}>
          <CurrentWeather weather={weather} />
          
          <View style={styles.forecastSticky}>
            <ForecastList forecast={weather.forecast} />
          </View>
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  weatherContainer: {
    flex: 1,
  },
  forecastSticky: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 20,
  }
});
