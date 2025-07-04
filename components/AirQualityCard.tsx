import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AirQualityData } from '@/hooks/useWeather';
import { getLastValueBefore } from '@/utils/weatherUtils';

export function getAqiColor(aqi: number): string {
  if (aqi <= 50)  return '#4caf50';   // green
  if (aqi <= 100) return '#ffeb3b';   // yellow
  if (aqi <= 150) return '#ff9800';   // orange
  return '#f44336';                   // red
}

export function getAqiCategory(aqi: number): string {
  return aqi <= 50 ? 'Good'
                 : aqi <= 100 ? 'Moderate'
                 : aqi <= 150 ? 'Unhealthy for Sensitive'
                 : 'Unhealthy';
}


export default function AirQualityCard({ data }: { data: AirQualityData }) {
  console.log("AirQualityCard component rendered with air quality data:");
  console.log(data);

  // Use getLastValueBefore helper to pull the closest AQI value from data.hourly.european_aqi array
  const aqi = getLastValueBefore(
    data.hourly.time,
    data.hourly.european_aqi,
    new Date()
  ) ?? data.hourly.european_aqi[data.hourly.european_aqi.length - 1]; // fallback if nothing found

  const category = getAqiCategory(aqi);

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.title}>AQI</Text>
        <View style={[styles.circle, { backgroundColor: getAqiColor(aqi) }]} testID="aq-circle">
          <Text style={styles.circleText}>{aqi}</Text>
        </View>
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
    elevation: 2,
  },
  title: {
    fontFamily: "Montserrat-Regular",
    color: "#444",
    fontWeight: '600',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  circleText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  category: {
    marginLeft: 8,
    color: '#555',
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },
});
