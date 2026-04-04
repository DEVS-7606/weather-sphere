import type { DailyForecast } from "@/domain/types";
import { weatherIcon, formatDay } from "@/utils/weatherUtils";

interface Props {
  data: DailyForecast;
  allMin: number;
  allMax: number;
  isFirst: boolean;
}

export default function DailyRow({ data, allMin, allMax, isFirst }: Props) {
  const range = allMax - allMin || 1;
  return (
    <div
      className="grid grid-cols-daily sm:grid-cols-daily-sm items-center gap-3 py-2.5 px-2 rounded-xl"
      style={{
        transition: "background 400ms var(--ease-atmo)",
        ...(isFirst ? {} : { boxShadow: "inset 0 1px 0 #40485d08" }),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#141f3860";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <span className="text-sm text-on-surface-variant truncate">
        {formatDay(data.date)}
      </span>
      <span className="text-center text-lg">
        {weatherIcon(data.weatherCode)}
      </span>
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-on-surface-variant w-7 text-right font-medium">
          {Math.round(data.minTemp)}°
        </span>
        <div
          className="flex-1 h-bar rounded-full relative overflow-hidden"
          style={{ background: "#1f2b49" }}
        >
          <div
            className="absolute inset-y-0 rounded-full"
            style={{
              left: `${((data.minTemp - allMin) / range) * 100}%`,
              right: `${100 - ((data.maxTemp - allMin) / range) * 100}%`,
              background: "linear-gradient(90deg, #4cd6fe, #ffb153)",
            }}
          />
        </div>
        <span className="text-xs font-semibold text-on-surface w-7">
          {Math.round(data.maxTemp)}°
        </span>
      </div>
    </div>
  );
}
