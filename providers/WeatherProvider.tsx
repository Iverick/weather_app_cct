import { useWeatherHook } from "@/hooks/useWeather";
import { createContext } from "react";

export const WeatherContext = createContext<ReturnType<typeof useWeatherHook> | undefined>(undefined);

// WeatherProvider allows components to access useWeather hook data and methods
export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const value = useWeatherHook();
  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}
