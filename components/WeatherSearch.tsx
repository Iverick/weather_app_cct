import React, { Dispatch, SetStateAction } from 'react';
import { View, TextInput, Button, StyleSheet, Switch, Text, Pressable } from 'react-native';

interface Props {
  city: string;
  setCity: (text: string) => void;
  onSubmit: () => void;
  useFahrenheit: boolean;
  setUseFahrenheit: Dispatch<SetStateAction<boolean>>;
}

// Displays weather search field and button inside container
export default function WeatherSearch({ city, setCity, onSubmit, useFahrenheit, setUseFahrenheit }: Props) {
  return(
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={city}
        onChangeText={setCity}
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
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    flex: 1,
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
});
