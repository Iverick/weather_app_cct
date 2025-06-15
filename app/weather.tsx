import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

interface WeatherData {
  location: string;
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export default function WeatherScreen() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  // const [coordinates, setCoordinates] = useState({
  //   lat: "",
  //   lon: "",
  // });

  // useEffect(() => {
  //   fetchWeather();
  // }, [coordinates]);

  const fetchCityCoordinates = async () => {
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter a city name.');
      return;
    }

    setLoading(true);
    setWeather(null);

    try {
      // First, I need to fetch coordinates for User's city input
      const geoCoords = await fetch(
        // TODO: &count=1 tells to fetch only one city instance - where are multiple of them actually!
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      )
      const geoData = await geoCoords.json();

      if (!geoData.results || !geoData.results.length) {
        throw new Error('City not found.');
      }

      const { latitude, longitude, country, name } = geoData.results[0];
    
      // setCoordinates({
      //   lat: latitude,
      //   lon: longitude,
      // })

      // Then, I can query open meteo API and get weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather) {
        throw new Error('Weather data unavailable.');
      }

      // populate weather component state with the data fetched from the APIs
      console.log(weatherData);
      setWeather({
        location: `${name}, ${country}`,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        weathercode: weatherData.current_weather.weathercode,
      })
      console.log(weather);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  // const fetchWeather = async () => {
  //   console.log(coordinates);
  // }

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
      {weather && 
        <View>
          <Text>Location: {weather.location}</Text>
          <Text>Temperature: {weather.temperature}</Text>
          <Text>Windspeed: {weather.windspeed}</Text>
          <Text>Weathercode: {weather.weathercode}</Text>
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
