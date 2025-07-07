import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ForecastDay } from '@/hooks/useWeather';
import ForecastRow from '@/components/ForecastRow';

interface Props {
  forecast: ForecastDay[];
  useFahrenheit: boolean;
}

// This components is used to display a 5 days weather forecast
export default function ForecastList({ forecast, useFahrenheit }: Props) {
  return (
    <FlatList
      data={forecast}
      keyExtractor={(item) => item.date}
      contentContainerStyle={{ paddingVertical: 10 }}
      showsHorizontalScrollIndicator={false}
      renderItem={({item}) => <ForecastRow item={item} useFahrenheit={useFahrenheit} />}
    />
  )
}

const styles = StyleSheet.create({
});
