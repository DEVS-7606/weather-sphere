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

    const timerId = setTimeout(() => {
      if (cancelled) return;

      // Debug: show what's happening with geolocation on this device
      const isSecure =
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost";
      if (!isSecure) {
        setError(
          `Geolocation requires HTTPS. Current: ${window.location.protocol}//${window.location.hostname}`,
        );
        setLoading(false);
        return;
      }

      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser.");
        setLoading(false);
        return;
      }

      // Call getCurrentPosition directly — this triggers the permission dialog
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          if (cancelled) return;
          try {
            const { latitude, longitude } = pos.coords;
            const { reverseGeocode } = await import("@/services/weatherApi");
            const geo = await reverseGeocode(latitude, longitude);
            const data = await fetchWeatherByCoords(
              latitude,
              longitude,
              geo.city,
              geo.country,
            );
            if (!cancelled) setWeather(data);
          } catch {
            if (!cancelled)
              setError("Could not get your location. Search for a city above.");
          } finally {
            if (!cancelled) setLoading(false);
          }
        },
        (err) => {
          if (cancelled) return;
          if (err.code === err.PERMISSION_DENIED) {
            setError(
              "Location access was denied. Please enable it in your browser's site settings, then reload.",
            );
          } else if (err.code === err.TIMEOUT) {
            setError("Location request timed out. Search for a city above.");
          } else {
            setError("Could not get your location. Search for a city above.");
          }
          setLoading(false);
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000,
        },
      );
    }, 100);

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
