# Component Documentation

Below is a quick overview of each custom component in this project, its location and a brief usage example.

---

## CurrentWeather

**Location:** `components/CurrentWeather.tsx`

**Description:**  
Renders the current weather panel: location name, formatted date/time, an icon based on `weathercode`, temperature with unit toggle, humidity, and wind speed.

**Usage:**
```
<CurrentWeather
  weather={weather}
  useFahrenheit={useFahrenheit}
/>
```
---


## ForecastList

**Location:** `components/ForecastList.tsx`

**Description:**  
Displays a vertical list of forecast rows. Each row shows the weekday, a weather icon, min/max temperatures, and a small bar visualizing the range.

**Usage:**
```
<ForecastList
  forecast={weather.forecast}
  useFahrenheit={useFahrenheit}
/>
```


## WeatherSearch

**Location:** `components/WeatherSearch.tsx`

**Description:**  
Renders a search bar with:
- A text input (with clear-text “×” button),
- A search icon,
- A “Use My Location” button,
- A dropdown showing either live suggestions (when typing ≥3 chars) or search history.

**Usage:**
```
<WeatherSearch
  city={city}
  setCity={setCity}
  onSearch={handleSearch}
  onSelectHistory={handleSelectHistory}
  onUseLocation={handleUseLocation}
  history={history}
  clearHistory={clearHistory}
  isFocused={isSearchFocused}
  setIsFocused={setIsSearchFocused}
/>
```


## AirQualityCard

**Location:** `components/AirQualityCard.tsx`

**Description:**  
Shows a horizontal strip of the following items:
- AQI as a large colored circle (green/yellow/orange/red)
- Air Quality category (text)

**Usage:**
```
<AirQualityCard data={airQuality} />
```


## WeatherScreen

**Location:** `components/WeatherScreen.tsx` (exported via app/index.tsx)

**Description:**  
The main screen tying everything together. It uses the useWeather hook to manage state and renders:
- `<WeatherSearch>`
- `<CurrentWeather> (when a city is selected)`
- `<AirQualityCard> (when air‐quality data is available)`
- `<ForecastList>`

**Usage:**
```
(Automatically picked up by Expo Router at /)

export default function WeatherScreen() {
  const {
    weather,
    airQuality,
    useFahrenheit,
    // ...handlers and state from useWeather()
  } = useWeather();

  return (
    <View style={styles.container}>
      <WeatherSearch /* … */ />
      {weather && <CurrentWeather /* … */ />}
      {airQuality && <AirQualityCard data={airQuality} />}
      {weather && <ForecastList /* … */ />}
    </View>
  );
}
```

## Hooks Documentation

Below is a summary of the custom React hooks provided by this project: where they live, what they return, and how to use them.

---

### `useWeather`

**Location:** `hooks/useWeather.tsx`

**Purpose:**  
Encapsulates all weather-and-air-quality fetching logic, caching, unit toggles, online/offline handling, and search history.

**Usage:**
```
import { useWeather } from '../hooks/useWeather';

export default function WeatherScreen() {
  const {
    // State
    city,                     // string — current text in the search box
    weather,                  // WeatherData | null
    airQuality,               // AirQualityData | null
    loading,                  // boolean
    error,                    // string | null
    history,                  // string[] — past searched city labels
    useFahrenheit,            // boolean
    selectedLocation,         // GeoLocation | null
    isConnected,              // boolean — network status

    // State setters
    setCity,                  // (text: string) => void
    setUseFahrenheit,         // (bool: boolean) => void
    setSelectedLocation,      // (loc: GeoLocation) => void

    // Actions
    fetchWeather,             // (lat: number, lon: number, label: string) => Promise<void>
    fetchWeatherForCurrentLocation, // () => Promise<void>
    handleSearch,             // () => Promise<void> — full “Search” flow
    handleSelectHistory,      // (cityLabel: string) => Promise<void>
    handleUseLocation,        // () => Promise<void> — full “Use My Location” flow

    // History helpers
    addToHistory,             // (label: string) => Promise<void>
    clearHistory,             // () => Promise<void>
  } = useWeather();

  // …render UI…
}
```


### `useSearchHistory`

**Location:** `hooks/useSearchHistory.tsx`

**Purpose:**  
Manages a simple list of previously searched city names in AsyncStorage.

**Usage:**
```
import { useSearchHistory } from '../hooks/useSearchHistory';

function SomeComponent() {
  const { history, addToHistory, clearHistory } = useSearchHistory();

  // When you successfully fetch new weather:
  addToHistory("Dublin, Ireland");

  // To render the history in a dropdown:
  history.map(label => /* … */);

  // To clear:
  clearHistory();
}
```
