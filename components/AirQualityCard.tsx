import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AirQualityData } from '@/hooks/useWeather';
import { getLastValueBefore } from '@/utils/weatherUtils';

export default function AirQualityCard({ data }: { data: AirQualityData }) {
  console.log("AirQualityCard component rendered with air quality data:");
  console.log(data);

  // Use getLastValueBefore helper to pull the closest AQI value from data.hourly.european_aqi array
  const aqi = getLastValueBefore(
    data.hourly.time,
    data.hourly.european_aqi,
    new Date()
  ) ?? data.hourly.european_aqi[data.hourly.european_aqi.length - 1]; // fallback if nothing found

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
