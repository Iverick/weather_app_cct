import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
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
    useFahrenheit,
    setUseFahrenheit,
  } = useWeather();

  // Use effect hook to automatically refetch weather data if the unit system switch was toggled
  useEffect(() => {
    if (weather) fetchWeather();
  }, [useFahrenheit]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Weather' }} />
      <Text style={styles.title}>Search Weather by City</Text>

      <View style={{ display: "flex", flexDirection: "row"}}>
        <WeatherSearch
          city={city}
          setCity={setCity}
          onSubmit={fetchWeather}
          useFahrenheit={useFahrenheit}
          setUseFahrenheit={setUseFahrenheit}
        />
        
        
      </View>
      {loading && <ActivityIndicator size="large" />}
      {error && (
        <Text style={styles.error}>
          {error}
        </Text>
      )}
      {weather && 
        <View style={styles.weatherContainer}>
          <CurrentWeather weather={weather} useFahrenheit={useFahrenheit} />
          
          <View style={styles.forecastSticky}>
            <ForecastList forecast={weather.forecast} useFahrenheit={useFahrenheit} />
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
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  weatherContainer: {
    flex: 1,
  },
  forecastSticky: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 20,
  },
});
