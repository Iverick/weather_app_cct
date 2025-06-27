import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Switch, Text, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { MagnifyingGlassIcon, TrashIcon } from 'react-native-heroicons/outline';
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
  history,
  onSelectHistory,
  clearHistory,
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

  const showSuggestions = isFocused && (
    suggestions.length > 0 || 
    // Show history items inside suggestions dropdown if city string is less than 3 chars
    (city.length < 3 && history.length > 0)
  );

  const searchContainerStyle = [
    styles.searchContainer,
    isFocused && styles.searchContainerFocused,
  ];
  
  return(
    <View style={styles.wrapper}>
      <View style={searchContainerStyle}>
        <MagnifyingGlassIcon
          size={20}
          color={isFocused ? "#4CB5AE" : "#888"} 
          style={styles.icon}
        />

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

        <Pressable style={styles.searchButton} onPress={onSubmit}>
          <MagnifyingGlassIcon size={21} color="#fff" />
        </Pressable>
      </View>
      
      {showSuggestions && (
        <View style={styles.dropdown}>
          {suggestions.length > 0
          // This block displays a list of suggested location for typed city string fetched from geocoding API
          ? <FlatList
              data={suggestions}
              keyExtractor={(item) => `${item.latitude}-${item.longitude}`}
              keyboardShouldPersistTaps="always"
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
                keyboardShouldPersistTaps="always"
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
                <TrashIcon size={20} color="red" />
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
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainerFocused: {
    borderColor: "#4CB5AE"
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  icon: {
    marginHorizontal: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    paddingHorizontal: 5,
  },
  celsiusText: {
    marginRight: 5,
  },
  fahrenheitText: {
    marginLeft: 5,
  },
  searchButton: {
    backgroundColor: "#40e0d0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    justifyContent: "center",
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
    flexDirection: 'row',
    justifyContent: 'center',
    
  },
  clearText: {
    marginLeft: 5,
    color: 'red',
    fontWeight: '600',
  },
});
