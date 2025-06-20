import { useSearchHistory } from '@/hooks/useSearchHistory';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Switch, Text, Pressable, FlatList, TouchableOpacity } from 'react-native';

interface Props {
  city: string;
  setCity: (text: string) => void;
  onSubmit: () => void;
  useFahrenheit: boolean;
  setUseFahrenheit: Dispatch<SetStateAction<boolean>>;
  history: string[];
  onSelectHistory: (city: string) => void;
  clearHistory: () => void;
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
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const showSuggestions = isFocused && !(city.length) && history.length > 0;
  
  return(
    <View style={styles.wrapper}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={city}
          onChangeText={setCity}
          onFocus={() => setIsFocused(true)}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.celsiusText}>°C</Text>
          <Switch
            value={useFahrenheit}
            onValueChange={setUseFahrenheit}
          />
          <Text style={styles.fahrenheitText}>°F</Text>
        </View>
        <Pressable style={styles.searchButton} onPress={onSubmit}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      {showSuggestions && (
        <View style={styles.dropdown}>
          <FlatList
            data={history}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPressIn={() => {
                  onSelectHistory(item);
                  setIsFocused(false);
                }}
                style={styles.dropdownItem}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
          
          <Pressable onPress={clearHistory} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear search history</Text>
          </Pressable>
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
    maxHeight: 150,
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
