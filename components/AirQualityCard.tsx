import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AirQualityData } from '@/hooks/useWeather';

export default function AirQualityCard({ data }: { data: AirQualityData }) {
  console.log("AirQualityCard component rendered with air quality data:");
  console.log(data);

  const idx = data.hourly.time.length - 1;
  const aqi = data.hourly.european_aqi[idx];

  const category = aqi <= 50 ? 'Good'
                 : aqi <= 100 ? 'Moderate'
                 : aqi <= 150 ? 'Unhealthy for Sensitive'
                 : 'Unhealthy';

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.title}>AQI</Text>
        <Text style={styles.aqi}>{aqi}</Text>
        <Text style={styles.category}>{category}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 2,
  },
  title: {
    fontFamily: "Montserrat-Regular",
    color: "#444",
    fontWeight: '600',
  },
  aqi: {
    marginLeft: 8,
    fontSize: 32,
    fontWeight: '800',
  },
  category: {
    marginLeft: 8,
    color: '#555',
  },
});
