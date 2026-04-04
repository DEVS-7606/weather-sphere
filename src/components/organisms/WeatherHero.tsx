import type { WeatherData } from "@/domain/types";
import { weatherIcon, weatherDescription } from "@/utils/weatherUtils";

interface Props {
  weather: WeatherData;
  compact?: boolean;
}

export default function WeatherHero({ weather: w, compact = false }: Props) {
  return (
    <section
      className={`relative overflow-hidden transition-all duration-1000 ease-hud bg-surface-low/70 backdrop-blur-3xl border border-white/4
        ${compact ? "rounded-2xl p-4" : "rounded-3xl p-6 sm:p-10 lg:p-12 shadow-hud"}
      `}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: compact ? 0 : 1,
          background:
            "radial-gradient(ellipse at 20% 40%, #4cd6fe06 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: compact ? 0 : 1,
          background:
            "radial-gradient(ellipse at 80% 30%, #ffb15305 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10">
        {/* COMPACT LAYOUT */}
        <div
          className="transition-all duration-1000 ease-hud overflow-hidden"
          style={{
            maxHeight: compact ? "200px" : "0px",
            opacity: compact ? 1 : 0,
            transform: compact
              ? "scale(1) translateY(0)"
              : "scale(0.98) translateY(-10px)",
            pointerEvents: compact ? "auto" : "none",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-on-surface whitespace-nowrap">
                {w.city}
              </h2>
              <p className="text-on-surface-variant text-xs">{w.country}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{weatherIcon(w.weatherCode)}</span>
              <span className="text-4xl font-bold tracking-tighter text-on-surface">
                {Math.round(w.temp)}°
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-on-surface-variant whitespace-nowrap">
            <span>{weatherDescription(w.weatherCode)}</span>
            <span className="w-px h-2.5 bg-outline-variant/30" />
            <span>
              H:{Math.round(w.maxTemp)}° L:{Math.round(w.minTemp)}°
            </span>
            <span className="w-px h-2.5 bg-outline-variant/30" />
            <span>Feels {Math.round(w.feelsLike)}°</span>
          </div>
        </div>

        {/* FULL LAYOUT */}
        <div
          className="transition-all duration-1000 ease-hud overflow-hidden"
          style={{
            maxHeight: compact ? "0px" : "500px",
            opacity: compact ? 0 : 1,
            transform: compact
              ? "scale(0.98) translateY(10px)"
              : "scale(1) translateY(0)",
            pointerEvents: compact ? "none" : "auto",
          }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-headline text-on-surface leading-tight">
            {w.city}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">{w.country}</p>

          <div className="flex items-end gap-5 mt-6 sm:mt-8">
            <span className="text-display sm:text-display-md lg:text-display-lg font-bold leading-display tracking-display text-on-surface">
              {Math.round(w.temp)}°
            </span>
            <div className="pb-3 sm:pb-5">
              <span className="text-5xl sm:text-6xl block">
                {weatherIcon(w.weatherCode)}
              </span>
              <p className="text-on-surface-variant text-sm mt-2 whitespace-nowrap">
                {weatherDescription(w.weatherCode)}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-4 text-sm text-on-surface-variant">
            <span>H: {Math.round(w.maxTemp)}°</span>
            <span className="w-px h-3 bg-outline-variant/30" />
            <span>L: {Math.round(w.minTemp)}°</span>
            <span className="w-px h-3 bg-outline-variant/30" />
            <span>Feels {Math.round(w.feelsLike)}°</span>
          </div>
        </div>
      </div>
    </section>
  );
}
