import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { ForecastDay } from '../hooks/useWeather';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getWeatherIconName } from '../utils/weatherIcons';
import { formatForecastDate } from '../utils/time';

interface Props {
  forecast: ForecastDay[];
}

// This components is used to display a 5 days weather forecast
export default function ForecastList({ forecast }: Props) {
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
            {item.max}
          </Text>
          <Text style={styles.cardTemp}>
            {item.min}
          </Text>
          <MaterialCommunityIcons
            name={getWeatherIconName(item.code)}
            size={32}
            style={styles.cardIcon}
            color="#bfbfbf"
          />
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
    width: 80,
  },
  cardDate: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardTemp: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },
  cardIcon: {
    marginTop: 10,
  },
});
