import { Badge } from "@/components/ui/badge";
import type { WeatherData } from "@/domain/types";
import {
  windDirection,
  formatTime,
  uvLabel,
  uvColor,
} from "@/utils/weatherUtils";
import DetailCard from "@/components/atoms/DetailCard";

interface Props {
  weather: WeatherData;
  compact?: boolean;
}

export function DetailGridTop({ weather: w, compact = false }: Props) {
  const val = compact
    ? "text-2xl font-bold text-on-surface tracking-tight"
    : "text-3xl sm:text-4xl font-bold text-on-surface tracking-tight";
  const note = compact
    ? "text-2xs text-on-surface-variant mt-auto pt-1"
    : "text-xs text-on-surface-variant mt-auto pt-3";
  const unit = compact
    ? "text-2xs font-normal text-on-surface-variant ml-0.5"
    : "text-sm font-normal text-on-surface-variant ml-1";

  return (
    <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
      <DetailCard label="🌡️ Feels Like" compact={compact}>
        <p className={val}>{Math.round(w.feelsLike)}°</p>
        <p className={note}>
          {w.feelsLike > w.temp
            ? "Feels warmer"
            : w.feelsLike < w.temp
              ? "Wind chill"
              : "Same as actual"}
        </p>
      </DetailCard>

      <DetailCard label="💧 Humidity" compact={compact}>
        <p className={val}>{w.humidity}%</p>
        <div className="h-1 rounded-full mt-2 overflow-hidden bg-surface-bright">
          <div
            className="h-full rounded-full"
            style={{
              width: `${w.humidity}%`,
              background: "linear-gradient(90deg, #4cd6fe, #21bde4)",
              transition: "width 600ms var(--ease-atmo)",
            }}
          />
        </div>
        <p className={note}>
          {w.humidity > 70
            ? "Quite humid"
            : w.humidity < 30
              ? "Dry air"
              : "Comfortable"}
        </p>
      </DetailCard>

      <DetailCard label="💨 Wind" compact={compact}>
        <p className={val}>
          {w.windSpeed}
          <span className={unit}>km/h</span>
        </p>
        <p className={note}>
          {windDirection(w.windDeg)} · {w.windDeg}°
        </p>
      </DetailCard>
    </div>
  );
}

export function DetailGridBottom({ weather: w, compact = false }: Props) {
  const val = compact
    ? "text-2xl font-bold text-on-surface tracking-tight"
    : "text-3xl sm:text-4xl font-bold text-on-surface tracking-tight";
  const note = compact
    ? "text-2xs text-on-surface-variant mt-auto pt-1"
    : "text-xs text-on-surface-variant mt-auto pt-3";
  const unit = compact
    ? "text-2xs font-normal text-on-surface-variant ml-0.5"
    : "text-sm font-normal text-on-surface-variant ml-1";

  return (
    <div
      className={`grid gap-4 h-full ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"}`}
    >
      <DetailCard label="☀️ UV Index" compact={compact}>
        <p className={val}>{w.uvIndex}</p>
        <div
          className="h-1 rounded-full mt-2 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, #4caf50, #ffeb3b, #ff9800, #f44336, #9c27b0)",
          }}
        >
          <div
            className="absolute top-1/2 w-2 h-2 rounded-full bg-on-surface"
            style={{
              left: `${Math.min((w.uvIndex / 11) * 100, 100)}%`,
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 4px #00000040",
            }}
          />
        </div>
        <Badge
          variant="outline"
          className="mt-auto text-3xs border-0 px-1.5 py-0 w-fit"
          style={{
            color: uvColor(w.uvIndex),
            background: uvColor(w.uvIndex) + "15",
          }}
        >
          {uvLabel(w.uvIndex)}
        </Badge>
      </DetailCard>

      <DetailCard label="🌅 Sunrise & Sunset" compact={compact}>
        <div className={`flex flex-col ${compact ? "gap-2" : "gap-3"} mt-1`}>
          <div className="flex items-center gap-2">
            <span className="text-amber text-sm">↑</span>
            <div>
              <p
                className={`font-semibold text-on-surface ${compact ? "text-xs" : "text-sm"}`}
              >
                {formatTime(w.sunrise)}
              </p>
              <p className="text-3xs text-on-surface-variant">Sunrise</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-violet text-sm">↓</span>
            <div>
              <p
                className={`font-semibold text-on-surface ${compact ? "text-xs" : "text-sm"}`}
              >
                {formatTime(w.sunset)}
              </p>
              <p className="text-3xs text-on-surface-variant">Sunset</p>
            </div>
          </div>
        </div>
      </DetailCard>

      <DetailCard label="🔵 Pressure" compact={compact}>
        <p className={val}>
          {Math.round(w.pressure)}
          <span className={unit}>hPa</span>
        </p>
        <p className={note}>
          {w.pressure > 1020
            ? "High pressure"
            : w.pressure < 1000
              ? "Low pressure"
              : "Normal"}
        </p>
      </DetailCard>

      <DetailCard label="☁️ Cloud Cover" compact={compact}>
        <p className={val}>{w.cloudCover}%</p>
        <div className="h-1 rounded-full mt-2 overflow-hidden bg-surface-bright">
          <div
            className="h-full rounded-full"
            style={{
              width: `${w.cloudCover}%`,
              background: "linear-gradient(90deg, #a3aac4, #6d758c)",
              transition: "width 600ms var(--ease-atmo)",
            }}
          />
        </div>
      </DetailCard>

      <DetailCard label="🌧️ Precipitation" compact={compact}>
        <p className={val}>
          {w.precipitation}
          <span className={unit}>mm</span>
        </p>
        <p className={note}>Total: {w.daily[0]?.precipSum ?? 0} mm</p>
      </DetailCard>
    </div>
  );
}
