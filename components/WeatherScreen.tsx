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
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowPathIcon, HomeIcon } from 'react-native-heroicons/outline';
import { CityLocation, useWeather } from '@/hooks/useWeather';
import WeatherSearch from '@/components/WeatherSearch';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastList from '@/components/ForecastList';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { fetchCityCoordinates } from '@/utils/geocoding';

// On Android, enable LayoutAnimation
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function WeatherScreen() {
  const {
    weather,
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
  } = useWeather();

  const { history, addToHistory, clearHistory } = useSearchHistory();

  // Use effect hook to automatically refetch weather data if the unit system switch was toggled
  useEffect(() => {
    if (!weather) return;

    // Allows to properly refetch weather data in fahrenheit units for the last search location
    if (lastFetchSource === 'city') {
      handleSearch();
    } else if (lastFetchSource === 'location') {
      fetchWeatherForCurrentLocation(true);
    }
  }, [useFahrenheit]);

  /**
   * Whenever `weather` changes, animate layout
   */ 
  useEffect(() => {
    if (weather) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }, [weather]);

  /*
   * Search weather for typed city value
   */
  const handleSearch = async () => {
    // Notify the user if his device is offline
    if (!isConnected) {
      setError("No network connection.");
      setLoading(false);
      return;
    }
    if (!selectedLocation && !city.trim()) {
      setError("Please select a city first.");
      return;
    }

    let location = selectedLocation;

    // No location set - user tries to force weather query for the city fetches from the history list
    // then it will try to get coordinates for the city
    if (!location) {
      // Parse city string into a proper format required by the geocoding API
      const cityParts = city.split(",").map(s => s.trim());
      const first = cityParts[0];
      const last = cityParts[cityParts.length - 1];
      const queryCity = `${first}, ${last}`;

      // Query geocoding API
      const res = await fetchCityCoordinates(queryCity);

      location = {
        name: res.name,
        country: res.country,
        admin1: res.admin1,
        latitude: res.latitude,
        longitude: res.longitude,
      };

      setSelectedLocation(location);
    }

    // **Guard** one more time, just in case
    if (!location) {
      setError('Failed to determine location.');
      return;
    }

    const { name, admin1, country, latitude, longitude } = location;
    const label = admin1
      ? `${name}, ${admin1}, ${country}`
      : `${name}, ${country}`;

    await fetchWeather(latitude, longitude, label);
    // After the fetching data, push city to the AsyncStorage history vault
    addToHistory(label);
  };

  /*
   * Search weather for the city selected from the searched cities dropdown menu
   */
  const handleSelectHistory = async (searchedCity: string) => {
    setCity(searchedCity);
    setError("");

    // Try to get from cache
    await fetchCachedWeather(searchedCity);
  }

  /*
   * Fetch weather for the device location
   */
  const handleUseLocation = async (forceCall: boolean = false) => {
    await fetchWeatherForCurrentLocation(forceCall);
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F9F2F4', '#E8F7F6']}
      locations={[0, 0.4, 1]}
      style={StyleSheet.absoluteFill}
    >
      <View style={styles.container}>
        {/* Refresh header button that enforces fetching weather data from API */}
        <Stack.Screen
          options={{
            headerRight: () => (
              <View style={styles.headerContainer}>
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

        <Stack.Screen options={{ title: 'Weather' }} />
        <Text style={styles.title}>Enter City Name</Text>
        <View style={styles.searchForm}>
          <WeatherSearch
            city={city}
            setCity={setCity}
            onSubmit={handleSearch}
            useFahrenheit={useFahrenheit}
            setUseFahrenheit={setUseFahrenheit}
            history={history}
            onSelectHistory={handleSelectHistory}
            clearHistory={clearHistory}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        </View>
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
              <ForecastList forecast={weather.forecast} useFahrenheit={useFahrenheit} />
            </View>
          </View>
        }
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12
  },
  unitsSwitchContainer: { 
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12
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
  refetchButton: {
    marginRight: 16
  },
  refetchIcon: {
    color: "#40e0d0"
  },
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
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
  searchForm: {
    display: "flex",
    flexDirection: "row",
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
