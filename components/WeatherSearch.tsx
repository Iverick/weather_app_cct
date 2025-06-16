import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface Props {
  city: string;
  setCity: (text: string) => void;
  onSubmit: () => void;
}

// Displays weather search field and button inside container
export default function WeatherSearch({ city, setCity, onSubmit }: Props) {
  return(
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter city"
        value={city}
        onChangeText={setCity}
        />
      <Button title="Search" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
