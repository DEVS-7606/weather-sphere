import { useState, useEffect, useCallback } from "react";
import type { GeoResult, WeatherData } from "@/domain/types";
import {
  fetchWeatherByCoords,
  fetchWeatherByLocation,
  fetchWeatherByLatLon,
} from "@/services/weatherApi";

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    // Use a small delay to survive React StrictMode's double-mount in dev.
    // In production StrictMode doesn't double-fire, but this is harmless there.
    const timerId = setTimeout(() => {
      if (cancelled) return;

      fetchWeatherByLocation()
        .then((data) => {
          if (!cancelled) setWeather(data);
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          const msg = err instanceof Error ? err.message : "";
          if (msg === "Location permission denied") {
            setError(
              "Location access was denied. Please enable it in your browser's site settings, then reload.",
            );
          } else if (msg === "Location request timed out") {
            setError("Location request timed out. Search for a city above.");
          } else {
            setError("Could not get your location. Search for a city above.");
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 100); // 100ms delay — lets StrictMode's unmount happen first

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, []);

  const selectCity = useCallback(async (result: GeoResult) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherByCoords(
        result.latitude,
        result.longitude,
        result.name,
        result.country,
      );
      setWeather(data);
    } catch {
      setError(`Could not fetch weather for ${result.name}.`);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectLocation = useCallback(
    async (latitude: number, longitude: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeatherByLatLon(latitude, longitude);
        setWeather(data);
      } catch {
        setError("Could not fetch weather for this location.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { weather, loading, error, selectCity, selectLocation };
}
