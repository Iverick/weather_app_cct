import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { ForecastDay } from '../hooks/useWeather';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getWeatherIconName } from '../utils/weatherIcons';

interface Props {
  forecast: ForecastDay[];
  useFahrenheit: boolean;
}

// This components is used to display a 5 days weather forecast
export default function ForecastList({ forecast, useFahrenheit }: Props) {
  return (
    <FlatList
      horizontal
      data={forecast}
      keyExtractor={(item) => item.date}
      contentContainerStyle={{ paddingVertical: 10 }}
      showsHorizontalScrollIndicator={false}
      renderItem={({item}) => (
        <View style={styles.card}>
          <Text style={styles.cardDate}>
            {new Date(item.date).toLocaleDateString(undefined, {
              weekday: 'short',
            })}
          </Text>
          <Text style={styles.cardTemp}>
            {item.max}°{useFahrenheit ? "F" : "C"}
          </Text>
          <Text style={styles.cardTemp}>
            {item.min}°{useFahrenheit ? "F" : "C"}
          </Text>
          <View style={styles.cardIconWrapper}>
            <MaterialCommunityIcons
              name={getWeatherIconName(item.code)}
              size={32}
              color="#333"
            />
          </View>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginRight: 10,
    alignItems: 'center',
    width: 80,
  },
  cardDate: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    marginBottom: 5,
  },
  cardTemp: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  cardIconWrapper: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 24,
    padding: 8,
    marginTop: 10,
  },
});
