import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { HomeIcon } from 'react-native-heroicons/outline';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WeatherData } from '@/hooks/useWeather';
import { getWeatherIconName } from '@/utils/weatherCondition';
import { getWeatherColor } from '@/utils/weatherCondition';
import { formatCurrentTime } from '@/utils/timeFormatter';

interface Props {
  weather: WeatherData;
  useFahrenheit: boolean;
}

// This components is used to display current weather data
export default function CurrentWeather({ weather, useFahrenheit }: Props) {
  // Setup react-native-reanimated properties to make the weather icon pulse
  // A shared value that oscillates between 1 and 1.2
  const scale = useSharedValue(1);

  // Start the looping pulse as soon as the component mounts
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 800 }),
        withTiming(1.0, { duration: 800 })
      ),
      -1, // infinite
      true
    );
  }, []);

  // Hook it up to an animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Animated.View style={animatedStyle}>
          <MaterialCommunityIcons
            name={getWeatherIconName(weather.weathercode)}
            size={64}
            color={getWeatherColor(weather.weathercode)}
          />
        </Animated.View>
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
