### API integration details

This project uses several Open-Meteo endpoints for geocoding, weather, forecast, and air-quality data.

**Geocoding: Cities List**
```
Fetches up to 10 matching cities for autocomplete suggestions.

GET https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(queryCity)}&count=10
```
####Example
```
https://geocoding-api.open-meteo.com/v1/search?name=Barce&count=10
```

**Geocoding: Single City Coordinates**
```
Fetches full geographic data for one city (used to confirm a search when you need to get the geographic coordinates for locally stored city search query)

GET `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
```

**Weather & 5-Day Forecast**
```
Fetches current weather plus a 5-day forecast (high/low temps, condition codes, humidity).

GET https://api.open-meteo.com/v1/forecast
  ?latitude=${latitude}
  &longitude=${longitude}
  &current_weather=true
  &hourly=relative_humidity_2m
  &daily=temperature_2m_max,temperature_2m_min,weather_code
  &forecast_days=5
  &timezone=auto
  ${unitParams}

unitParams is appended as

&temperature_unit=${temperatureUnit}
&windspeed_unit=${windspeedUnit}
```
####Example
```
https://api.open-meteo.com/v1/forecast?latitude=41.38879&longitude=2.15899&current_weather=true&hourly=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=5&timezone=auto
```

**Air Quality**
```
Fetches hourly air-quality metrics

GET https://air-quality-api.open-meteo.com/v1/air-quality
  ?latitude=${latitude.toFixed(4)}
  &longitude=${longitude.toFixed(4)}
  &forecast_days=1
  &hourly=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi
  &timezone=${encodeURIComponent(timezone)}
```
####Example
```
https://air-quality-api.open-meteo.com/v1/air-quality?latitude=41.3888&longitude=2.1590&forecast_days=1&hourly=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi&timezone=auto
```