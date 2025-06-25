import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Switch, Text, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { fetchCitiesList, GeoLocation } from '@/utils/geocoding';
import { CityLocation } from '@/hooks/useWeather';

interface Props {
  city: string;
  setCity: (text: string) => void;
  onSubmit: () => void;
  useFahrenheit: boolean;
  setUseFahrenheit: Dispatch<SetStateAction<boolean>>;
  history: string[];
  onSelectHistory: (city: string) => void;
  clearHistory: () => void;
  selectedLocation: CityLocation | null;
  setSelectedLocation: (coords: CityLocation | null) => void;
}

// Displays weather search field and button inside container
export default function WeatherSearch({ 
  city,
  setCity,
  onSubmit,
  useFahrenheit,
  setUseFahrenheit,
  history,
  onSelectHistory,
  clearHistory,
  selectedLocation,
  setSelectedLocation,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);

  useEffect(() => {
    if (city.length < 3) {
      setSuggestions([]);
      return;
    }

    // Use timer here to prevent an API call immediately after detecting an added char to city state variable
    const handler = setTimeout(async () => {
      const matches = await fetchCitiesList(city);
      // console.log("42. WeatherSearch. fetched matches");
      // console.log(matches);
      setSuggestions(matches);
    }, 500);

    return () => clearTimeout(handler);
  }, [city]);

  const showSuggestions = isFocused && (suggestions.length > 0 || history.length > 0);
  
  return(
    <View style={styles.wrapper}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={city}
          onChangeText={setCity}
          onFocus={() => {
            setSelectedLocation(null);
            setIsFocused(true)
          }}
          // Set onBlur delay here to make sure child onPress will always run 
          onBlur={() => setTimeout(() => {
            setIsFocused(false)}, 200)
          }
        />

        {selectedLocation && (
          <View style={styles.switchContainer}>
            <Text style={styles.celsiusText}>°C</Text>
            <Switch
              value={useFahrenheit}
              onValueChange={setUseFahrenheit}
            />
            <Text style={styles.fahrenheitText}>°F</Text>
          </View>
        )}
        
        <Pressable style={styles.searchButton} onPress={onSubmit}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>
      
      {showSuggestions && (
        <View style={styles.dropdown}>
          {suggestions.length > 0
          // This block displays a list of suggested location for typed city string fetched from geocoding API
          ? <FlatList
              data={suggestions}
              keyExtractor={(item) => `${item.latitude}-${item.longitude}`}
              renderItem={({ item: location }) => (
                <TouchableOpacity
                  onPressIn={() => {
                  console.log("selected city");
                  console.log(location);
                  setSelectedLocation({
                    name: location.name,
                    country: location.country,
                    admin1: location.admin1,
                    latitude: location.latitude,
                    longitude: location.longitude,
                  });
                  setCity(location.name);
                  setIsFocused(false);
                }}
                style={styles.dropdownItem}
                >
                  <Text>{location.name}, {location.admin1}, {location.country}</Text>
                </TouchableOpacity>
              )}
            />
          // This block displays a list of stored cities searches in history storage
          : (<>
              <FlatList
                data={history}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPressIn={() => {
                      setIsFocused(false);
                      onSelectHistory(item);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              
              <Pressable onPress={clearHistory} style={styles.clearButton}>
                <Text style={styles.clearText}>Clear search history</Text>
              </Pressable>
            </>)
          }
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 10,
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 5,
  },
  celsiusText: {
    marginRight: 8,
  },
  fahrenheitText: {
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: '600',
    fontSize: 16,
  },
  // Dropdown feature styles
  dropdown: {
    backgroundColor: '#fafafa',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 2,
    maxHeight: 250,
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  clearButton: {
    padding: 10,
    alignItems: 'center',
  },
  clearText: {
    color: 'red',
    fontWeight: '600',
  },
});
