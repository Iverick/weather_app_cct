import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function WeatherScreen() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({
    lat: "",
    lon: "",
  });

  useEffect(() => {
    fetchWeather();
  }, [coordinates])

  const fetchCityCoordinates = async () => {
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter a city name.');
      return;
    }

    setLoading(true);

    try {
      const geoCoords = await fetch(
        // TODO: &count=1 tells to fetch only one city instance - where are multiple of them actually!
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      )
      const geoData = await geoCoords.json();
      setCoordinates({
        lat: geoData.results[0].latitude,
        lon: geoData.results[0].longitude,
      })
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchWeather = async () => {
    console.log(coordinates);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Weather' }} />
      <Text style={styles.title}>Search Weather by City</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.cityInput}
          placeholder="Enter city"
          value={city}
          onChangeText={setCity}
        />
        <Button title="Search" onPress={fetchCityCoordinates} />
      </View>
      {loading && <ActivityIndicator size="large" />}
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
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  cityInput: {
    flex: 1,
    borderColor: "#aaa",
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
})
