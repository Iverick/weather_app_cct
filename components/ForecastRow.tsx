import { Text, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ForecastDay } from "@/hooks/useWeather";
import { formatForecastDate } from "@/utils/timeFormatter";
import { getWeatherColor, getWeatherIconName } from "@/utils/weatherCondition";

export default function ForecastRow({
  item,
  useFahrenheit,
}: {
  item: ForecastDay;
  useFahrenheit: boolean;
}) {
  const dayLabel = formatForecastDate(item.date);
  const min = item.min.toFixed(0);
  const max = item.max.toFixed(0);
  const color = getWeatherColor(item.code);

  const span = Math.max(0, item.max - item.min);
  const fillWidth = Math.min(span * 4, 100);

  return (
    <View style={styles.cardRow}>
      <Text style={styles.cardDate}>
        {dayLabel}
      </Text>

      <MaterialCommunityIcons
        name={getWeatherIconName(item.code)}
        size={32}
        color={getWeatherColor(item.code)}
        style={styles.icon}
      />

      <Text style={styles.cardTemp}>
        {min}°{useFahrenheit ? "F" : "C"}
      </Text>

      <View style={styles.scale}>
        <View style={[styles.scaleFill, { width: fillWidth, backgroundColor: color }]} />
      </View>
      
      <Text style={styles.cardTemp}>
        {max}°{useFahrenheit ? "F" : "C"}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 4,
  },
  cardDate: {
    flex: 1,
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
  },
  cardTemp: {
    width: 40,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  icon: {
    width: 62,
  },
  scale: {
    flex: 0.3,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  scaleFill: {
    height: '100%',
  },
});
