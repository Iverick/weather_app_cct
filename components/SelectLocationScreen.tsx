import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from "expo-router";
import { useWeather } from '@/hooks/useWeather';
import WeatherSearch from '@/components/WeatherSearch';

export default function SelectLocationScreen() {
  const {
    city,
    setCity,
    history,
    error,
    loading,
    addToHistory,
    clearHistory,
    selectedLocation,
    setSelectedLocation,
    fetchWeather,
    handleSearch,
    handleSelectHistory,
  } = useWeather();

  const router = useRouter();

   // Wraps hook methods and navigates back to the index route afterwards
  const onSearch = async () => {
    await handleSearch();
    if (!error) {
      router.replace('/');
    }
  };

  const onSelectHistory = async (city: string) => {
    await handleSelectHistory(city);
    if (!error) {
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '' }} />

      <Text style={styles.title}>Enter City Name</Text>
      <View style={styles.searchForm}>
        <WeatherSearch
          city={city}
          setCity={setCity}
          onSubmit={onSearch}
          history={history}
          onSelectHistory={onSelectHistory}
          clearHistory={clearHistory}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchForm: {
    display: "flex",
    flexDirection: "row",
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
});
