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
    // Check permission state first to give a better UX message if denied
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((status) => {
          if (status.state === "denied") {
            setError(
              "Location is blocked. Please enable it in your browser's site settings, then reload.",
            );
            setLoading(false);
          } else {
            // "granted" or "prompt" — proceed with the request
            fetchWeatherByLocation()
              .then(setWeather)
              .catch((err: unknown) => {
                const msg = err instanceof Error ? err.message : "";
                if (msg === "Location permission denied") {
                  setError(
                    "Location access was denied. Please enable it in your browser's site settings, then reload.",
                  );
                } else if (msg === "Location request timed out") {
                  setError(
                    "Location request timed out. Search for a city above.",
                  );
                } else {
                  setError(
                    "Could not get your location. Search for a city above.",
                  );
                }
              })
              .finally(() => setLoading(false));
          }
        })
        .catch(() => {
          // Permissions API not supported — try directly
          fetchWeatherByLocation()
            .then(setWeather)
            .catch(() =>
              setError("Could not get your location. Search for a city above."),
            )
            .finally(() => setLoading(false));
        });
    } else {
      // No Permissions API (older iOS Safari) — try directly
      fetchWeatherByLocation()
        .then(setWeather)
        .catch(() =>
          setError("Could not get your location. Search for a city above."),
        )
        .finally(() => setLoading(false));
    }
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
