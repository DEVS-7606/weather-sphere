import type { HourlyForecast } from "@/domain/types";
import { weatherIcon, formatHour } from "@/utils/weatherUtils";

export default function HourlyItem({
  data,
  isNow,
}: {
  data: HourlyForecast;
  isNow: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center gap-2 min-w-hourly py-3 px-2 rounded-2xl"
      style={{
        background: isNow ? "#4cd6fe12" : "transparent",
        transition: "background 400ms var(--ease-atmo)",
      }}
      onMouseEnter={(e) => {
        if (!isNow) e.currentTarget.style.background = "#1f2b4980";
      }}
      onMouseLeave={(e) => {
        if (!isNow) e.currentTarget.style.background = "transparent";
      }}
    >
      <span className="text-2xs text-on-surface-variant font-medium">
        {isNow ? "Now" : formatHour(data.time)}
      </span>
      <span className="text-xl">{weatherIcon(data.weatherCode)}</span>
      <span className="text-sm font-semibold text-on-surface">
        {Math.round(data.temp)}°
      </span>
    </div>
  );
}
