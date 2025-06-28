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
import { useWeather } from '@/hooks/useWeather';
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
      fetchWeatherForCurrentLocation();
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

    console.log("84. weather. search button clicked")
    console.log(!selectedLocation)
    console.log(!city.trim())

    // TODO: Fix a bug here
    if (!selectedLocation || !city.trim()) {
      setError("Please select a city first.");
      return;
    }

    const { name, admin1, country, latitude, longitude } = selectedLocation;
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
  const handleSelectHistory = async (searchedCity: string, force = false) => {
    console.log("67. weather. history drowdown element clicked") 
    console.log(searchedCity)
    console.log(selectedLocation)

    setCity(searchedCity);
    setError("");

    // Try to get from cache unless it's force to make an API call
    if (!force) {
      const res = await fetchCachedWeather(searchedCity);
      if (res) return;
    }
    
    // Notify the user if his device is offline
    if (!isConnected) {
      setError("No network connection.");
      setLoading(false);
      return;
    }

    // Have to remove admin1 from the searchedCity label due to geocoding API schema
    // parts = [ name, admin1, country ]
    const parts = searchedCity.split(',').map(s => s.trim());
    const queryCity =
      parts.length === 3
        ? `${parts[0]},${parts[2]}`
        : searchedCity; 

    // If weather not in cache, get geocode data and fetch weather data by coords
    // Do this because useSearchHistory hook don't store city coordinates in the AsyncStorage
    const { latitude, longitude } = await fetchCityCoordinates(queryCity);

    if (!location) {
      setError(`Could not geocode stored city: ${searchedCity}`);
      return;
    }

    await fetchWeather(latitude, longitude, searchedCity);
    addToHistory(searchedCity);
  }

  /*
   * Fetch weather for the device location
   */
  const handleUseLocation = async () => {
    // Notify the user if his device is offline
    if (!isConnected) {
      setError("No network connection.");
      setLoading(false);
      return;
    }
    
    await fetchWeatherForCurrentLocation();
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
                <Pressable onPress={() => handleSearch()} hitSlop={8}>
                  <ArrowPathIcon size={24} color="#40e0d0" />
                </Pressable>
              </View>
            ),
          }}
        />

        {/* Location button */}
        <Pressable
          onPress={handleUseLocation}
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
                  onRefresh={() => handleSelectHistory(city, true)}
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
