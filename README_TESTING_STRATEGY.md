## Testing Strategy

This section outlines our overall approach to ensuring the Weather App is reliable, performant, and user-friendly. It covers six testing categories: UI, user, usability, acceptance, unit, and deployment testing.

---

### 1. UI Testing  
- **Tools:** Jest + React Native Testing Library  
- **Scope:**  
  - Snapshot tests for `CurrentWeather`, `ForecastList`, `AirQualityCard`, `WeatherSearch`.  
  - Interaction tests:  
    - Tapping "Search" and "Use My Location" buttons  
    - Dropdown open/close and selection  
    - Unit toggle switch behavior  
  - Verify conditional rendering (loading spinner, error messages, data panels).

---

### 2. User Testing
- **Method:** Manual hands-on testing  
- **Tasks:**  
  - Search for multiple cities (valid/invalid)  
  - Use location permission flow  
  - Toggle units °C/°F  
  - Inspect 5-day forecast and AQI display  
- **Outcome:** Confirmed correct data fetch and UX flows on web simulator and real Android device.

---

### 3. Usability Testing
- **Method:** Manual self-guided exploration  
- **Checks:**  
  - Input focus and blur behavior  
  - Correctly displaying dropdown
  - Clear (×) button resets search and location  
  - Properly displaying layout on phone and tablet screen sizes  
- **Improvements:** Adjusted auto sizing, touch handling, and container padding.

---

### 4. Acceptance Testing  
- **Criteria from spec:**  
  - Location search and history persistence  
  - Current weather + icons + humidity  
  - 5-day forecast cards with high/low temps  
  - Offline fallback to last cached data  
  - Air-qualitydisplay  
- **Execution:** Manually verified each acceptance criteria and logged any discrepancies.

---

### 5. Unit Testing  
- **Tools:** Jest + @testing-library/react-native + react-hooks testing library  
- **Coverage:**  
  - **Hooks:** `useWeather`, `useSearchHistory` (fetch flows, caching, error/offline handling)  
  - **Utilities:** URL builders, `formatLocation`, `geocoding`  
  - **Components:** Snapshot and behavior tests for `WeatherSearch`, `AirQualityCard`, `CurrentWeather`, `Weather Screen`.  
- **Command:** `npm test`
- **CI Integration:** A GitHub Actions workflow (`.github/workflows/unitTests.yml`) runs `npm test` on every push and pull request—ensure the project is configured to run this CI.

---

### 6. Deployment Testing  
- **Platforms:**  
  - Expo Web  
  - Expo Go on a physical Android devices 
- **Checks:**  
  - App launches without errors  
  - Core flows work after fresh install  
  - Performance (startup time, scrolls, animations) acceptable  
- **Outcome:** Smoke-tested application build before final submission.
