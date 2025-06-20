import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { useWeather } from '@/hooks/useWeather';
import WeatherSearch from '@/components/WeatherSearch';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastList from '@/components/ForecastList';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSearchHistory } from '@/hooks/useSearchHistory';

export default function WeatherScreen() {
  const {
    weather,
    city,
    setCity,
    loading,
    error,
    fetchWeather,
    fetchWeatherForCurrentLocation,
    useFahrenheit,
    setUseFahrenheit,
    lastFetchSource,
  } = useWeather();

  const { history, addToHistory, clearHistory } = useSearchHistory();

  // Use effect hook to automatically refetch weather data if the unit system switch was toggled
  useEffect(() => {
    if (!weather) return;

    // Allows to properly refetch weather data in fahrenheit units for the last search location
    if (lastFetchSource === 'city') {
      fetchWeather(true);
    } else if (lastFetchSource === 'location') {
      fetchWeatherForCurrentLocation();
    }
  }, [useFahrenheit]);

  /*
   * Search weather for typed city value
   */
  const handleSearch = async (forceAPICall = false, overrideCity?: string) => {
    // Override city value if it passed in arguments
    const queryCity = overrideCity ?? city;
    await fetchWeather(forceAPICall, queryCity);
    // After the fetching data, push city to the AsyncStorage history vault
    addToHistory(city);
  };


  /*
   * Search weather for the city selected from the searched cities dropdown menu
   */
  const handleSelectHistory = async (searchedCity: string) => {
    console.log("history drowdown element clicked") 
    console.log(searchedCity) 
    setCity(searchedCity);
    await handleSearch(false, searchedCity);
  }

  /*
   * Fetch weather for the device location
   */
  const handleUseLocation = async () => {
    await fetchWeatherForCurrentLocation();
  };

  return (
    <View style={styles.container}>

      {/* Refresh header button that enforces fetching weather data from API */}
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => handleSearch(true)} style={styles.refetchButton}>
              <MaterialCommunityIcons name="refresh" size={24} style={styles.refetchIcon} />
            </Pressable>
          ),
        }}
      />

      {/* Location button */}
      <Pressable
        onPress={handleUseLocation}
        style={styles.locationButton}
      >
        <MaterialCommunityIcons name="home-map-marker" size={28} color="#1e90ff" />
      </Pressable>

      <Stack.Screen options={{ title: 'Weather' }} />
      <Text style={styles.title}>Search Weather by City</Text>
      <View style={styles.searchForm}>
        <WeatherSearch
          city={city}
          setCity={setCity}
          onSubmit={() => handleSearch()}
          useFahrenheit={useFahrenheit}
          setUseFahrenheit={setUseFahrenheit}
          history={history}
          onSelectHistory={handleSelectHistory }
          clearHistory={clearHistory}
        />
      </View>
      {loading && <ActivityIndicator size="large" />}
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
                onRefresh={() => handleSearch(true)}
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
  )
}

const styles = StyleSheet.create({
  refetchButton: {
    marginRight: 16
  },
  refetchIcon: {
    color: "#1e90ff"
  },
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
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
