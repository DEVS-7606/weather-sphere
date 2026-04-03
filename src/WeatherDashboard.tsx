import type { WeatherData } from "./types";
import {
  weatherIcon,
  weatherDescription,
  windDirection,
  formatTime,
  formatHour,
  formatDay,
  uvLabel,
  uvColor,
} from "./weatherUtils";

interface Props {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export default function WeatherDashboard({ weather, loading, error }: Props) {
  if (loading) {
    return (
      <div className="dash-center">
        <div className="spinner" />
        <p>Fetching weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dash-center">
        <p className="dash-error">{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  const w = weather;

  return (
    <div className="dashboard">
      {/* ===== Hero Section ===== */}
      <section className="hero-section">
        <div className="hero-left">
          <div className="hero-location">
            <h1>{w.city}</h1>
            <span>{w.country}</span>
          </div>
          <div className="hero-temp-row">
            <span className="hero-temp">{Math.round(w.temp)}°</span>
            <div className="hero-condition">
              <span className="hero-icon">{weatherIcon(w.weatherCode)}</span>
              <span className="hero-desc">
                {weatherDescription(w.weatherCode)}
              </span>
            </div>
          </div>
          <div className="hero-range">
            H: {Math.round(w.maxTemp)}° &nbsp; L: {Math.round(w.minTemp)}°
          </div>
        </div>
      </section>

      {/* ===== Hourly Forecast ===== */}
      <section className="section-card">
        <h3 className="section-title">🕐 Hourly Forecast</h3>
        <div className="hourly-scroll">
          {w.hourly.map((h, i) => (
            <div className="hourly-item" key={i}>
              <span className="hourly-time">
                {i === 0 ? "Now" : formatHour(h.time)}
              </span>
              <span className="hourly-icon">{weatherIcon(h.weatherCode)}</span>
              <span className="hourly-temp">{Math.round(h.temp)}°</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 7-Day Forecast ===== */}
      <section className="section-card">
        <h3 className="section-title">📅 7-Day Forecast</h3>
        <div className="daily-list">
          {w.daily.map((d, i) => (
            <div className="daily-row" key={i}>
              <span className="daily-day">{formatDay(d.date)}</span>
              <span className="daily-icon">{weatherIcon(d.weatherCode)}</span>
              <div className="daily-bar-wrapper">
                <span className="daily-min">{Math.round(d.minTemp)}°</span>
                <div className="daily-bar">
                  <div
                    className="daily-bar-fill"
                    style={{
                      left: `${((d.minTemp - w.daily.reduce((a, x) => Math.min(a, x.minTemp), 100)) / (w.daily.reduce((a, x) => Math.max(a, x.maxTemp), -100) - w.daily.reduce((a, x) => Math.min(a, x.minTemp), 100))) * 100}%`,
                      right: `${100 - ((d.maxTemp - w.daily.reduce((a, x) => Math.min(a, x.minTemp), 100)) / (w.daily.reduce((a, x) => Math.max(a, x.maxTemp), -100) - w.daily.reduce((a, x) => Math.min(a, x.minTemp), 100))) * 100}%`,
                    }}
                  />
                </div>
                <span className="daily-max">{Math.round(d.maxTemp)}°</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Detail Cards Grid ===== */}
      <div className="details-grid">
        {/* Feels Like */}
        <div className="detail-card">
          <div className="detail-card-header">
            <span>🌡️</span> <span>FEELS LIKE</span>
          </div>
          <div className="detail-card-value">{Math.round(w.feelsLike)}°</div>
          <div className="detail-card-note">
            {w.feelsLike > w.temp
              ? "Humidity makes it feel warmer"
              : w.feelsLike < w.temp
                ? "Wind makes it feel cooler"
                : "Similar to actual temperature"}
          </div>
        </div>

        {/* Humidity */}
        <div className="detail-card">
          <div className="detail-card-header">
            <span>💧</span> <span>HUMIDITY</span>
          </div>
          <div className="detail-card-value">{w.humidity}%</div>
          <div className="detail-card-meter">
            <div className="meter-fill" style={{ width: `${w.humidity}%` }} />
          </div>
          <div className="detail-card-note">
            {w.humidity > 70
              ? "It's quite humid"
              : w.humidity < 30
                ? "Air is dry"
                : "Comfortable humidity"}
          </div>
        </div>

        {/* Wind */}
        <div className="detail-card">
          <div className="detail-card-header">
            <span>💨</span> <span>WIND</span>
          </div>
          <div className="detail-card-value">
            {w.windSpeed} <small>km/h</small>
          </div>
          <div className="detail-card-note">
            Direction: {windDirection(w.windDeg)} ({w.windDeg}°)
          </div>
        </div>

        {/* UV Index */}
        <div className="detail-card">
          <div className="detail-card-header">
            <span>☀️</span> <span>UV INDEX</span>
          </div>
          <div className="detail-card-value">{w.uvIndex}</div>
          <div className="uv-bar">
            <div
              className="uv-indicator"
              style={{ left: `${Math.min((w.uvIndex / 11) * 100, 100)}%` }}
            />
          </div>
          <div
            className="detail-card-note"
            style={{ color: uvColor(w.uvIndex) }}
          >
            {uvLabel(w.uvIndex)}
          </div>
        </div>

        {/* Sunrise & Sunset */}
        <div className="detail-card">
          <div className="detail-card-header">
            <span>🌅</span> <span>SUNRISE & SUNSET</span>
          </div>
          <div className="sun-times">
            <div className="sun-row">
              <span>↑</span>
              <span>{formatTime(w.sunrise)}</span>
            </div>
            <div className="sun-row">
              <span>↓</span>
              <span>{formatTime(w.sunset)}</span>
            </div>
          </div>
        </div>

        {/* Pressure */}
        <div className="detail-card">
          <div className="detail-card-header">
            <span>🔵</span> <span>PRESSURE</span>
          </div>
          <div className="detail-card-value">
            {Math.round(w.pressure)} <small>hPa</small>
          </div>
          <div className="detail-card-note">
            {w.pressure > 1020
              ? "High pressure"
              : w.pressure < 1000
                ? "Low pressure"
                : "Normal pressure"}
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="detail-card">
          <div className="detail-card-header">
            <span>☁️</span> <span>CLOUD COVER</span>
          </div>
          <div className="detail-card-value">{w.cloudCover}%</div>
          <div className="detail-card-meter">
            <div
              className="meter-fill cloud-fill"
              style={{ width: `${w.cloudCover}%` }}
            />
          </div>
        </div>

        {/* Precipitation */}
        <div className="detail-card">
          <div className="detail-card-header">
            <span>🌧️</span> <span>PRECIPITATION</span>
          </div>
          <div className="detail-card-value">
            {w.precipitation} <small>mm</small>
          </div>
          <div className="detail-card-note">
            Today's total: {w.daily[0]?.precipSum ?? 0} mm
          </div>
        </div>
      </div>
    </div>
  );
}
