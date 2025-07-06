import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PlusIcon, HomeIcon } from 'react-native-heroicons/outline';
import { useWeather } from '@/hooks/useWeather';
import WeatherSearch from '@/components/WeatherSearch';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastList from '@/components/ForecastList';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { fetchCityCoordinates, formatLocation } from '@/utils/geocoding';
import AirQualityCard from '@/components/AirQualityCard';

// On Android, enable LayoutAnimation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function WeatherScreen() {
  const {
    weather,
    airQuality,
    city,
    setCity,
    loading,
    error,
    setError,
    fetchWeather,
    fetchCachedWeather,
    fetchWeatherForCurrentLocation,
    useFahrenheit,
    setUseFahrenheit,
    lastFetchSource,
    selectedLocation,
    setSelectedLocation,
    isConnected,
    setLoading,
    handleSearch,
    handleUseLocation,
  } = useWeather();

  const router = useRouter();

  /**
   * Whenever `weather` changes, animate layout
   */ 
  useEffect(() => {
    if (weather) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }, [weather]);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F9F2F4', '#E8F7F6']}
      locations={[0, 0.4, 1]}
      style={StyleSheet.absoluteFill}
    >
      <View style={styles.container}>
        <Stack.Screen options={{ title: '' }} />
        <Stack.Screen
          options={{
            headerLeft: () => (
              <Pressable
                onPress={() => router.push('/select-location')}
                style={styles.selectLocationButton}
              >
                <PlusIcon size={20} color="#40e0d0" />
                <Text style={styles.selectLocationText}>Select Location</Text>
              </Pressable>
            ),
            headerRight: () => (
              <View>
                {selectedLocation && (
                  <View style={styles.unitsSwitchContainer}>
                    <Text style={styles.celsiusText}>°C</Text>
                    <Switch
                      value={useFahrenheit}
                      onValueChange={setUseFahrenheit}
                    />
                    <Text style={styles.fahrenheitText}>°F</Text>
                  </View>
                )}
              </View>
            ),
          }}
        />

        {/* Location button */}
        <Pressable
          onPress={() => handleUseLocation()}
          style={styles.locationButton}
        >
          <HomeIcon size={28} color="#40e0d0" />
        </Pressable>

        {loading && (
          <ActivityIndicator
            testID="loading-indicator"
            size="large"
          />
        )}
        {error && (
          <Text style={styles.error}>
            {error}
          </Text>
        )}
        {/* Weather data displayed here */}
        {weather && 
          <View style={styles.weatherContainer}>
            {/* Use can scroll weather data view to enforce fetching weather from API */}
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => {
                    if (lastFetchSource === 'city') {
                      handleSearch()
                    } else if (lastFetchSource === 'location') {
                      handleUseLocation(true);
                    }
                  }}
                />
              }
            >
              <CurrentWeather weather={weather} useFahrenheit={useFahrenheit} />
            </ScrollView>
              
            <View style={styles.forecastSticky}>
              {airQuality && <AirQualityCard data={airQuality} />}
              <ForecastList forecast={weather.forecast} useFahrenheit={useFahrenheit} />
            </View>
          </View>
        }
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  // header elements
  unitsSwitchContainer: { 
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24
  },
  celsiusText: {
    marginRight: 4,
    color: "#40e0d0",
    fontSize: 17
  },
  fahrenheitText: {
    marginLeft: 4,
    color: "#40e0d0",
    fontSize: 17
  },
  selectLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  selectLocationText: {
    marginLeft: 6,
    color: '#40e0d0',
    fontWeight: '600'
  },
  refetchButton: {
    marginRight: 16
  },
  refetchIcon: {
    color: "#40e0d0"
  },
  // body elements
  locationButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
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
    justifyContent: 'space-between',
  },
  forecastSticky: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 5,
  },
});
