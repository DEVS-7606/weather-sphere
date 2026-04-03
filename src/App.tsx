import { useState, useEffect } from "react";
import type { GeoResult, WeatherData } from "./types";
import { fetchWeatherByCoords, fetchWeatherByLocation } from "./weatherApi";
import SearchBar from "./SearchBar";
import WeatherDashboard from "./WeatherDashboard";
import ChatWidget from "./ChatWidget";
import "./App.css";

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load weather for user's location on mount
  useEffect(() => {
    fetchWeatherByLocation()
      .then(setWeather)
      .catch(() =>
        setError("Could not get your location. Search for a city above."),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleCitySelect = async (result: GeoResult) => {
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
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌤️ Weather App</h1>
        <SearchBar onSelect={handleCitySelect} />
      </header>

      <main className="app-main">
        <WeatherDashboard weather={weather} loading={loading} error={error} />
      </main>

      <ChatWidget />
    </div>
  );
}

export default App;
