import type { DailyForecast as DailyForecastType } from "@/domain/types";
import DailyRow from "@/components/molecules/DailyRow";

interface Props {
  daily: DailyForecastType[];
  compact?: boolean;
}

export default function DailyForecast({ daily }: Props) {
  const allMin = Math.min(...daily.map((d) => d.minTemp));
  const allMax = Math.max(...daily.map((d) => d.maxTemp));

  return (
    <section className="rounded-3xl p-6 sm:p-8 bg-surface-low/70 backdrop-blur-3xl border border-white/4 shadow-hud min-w-0">
      <p className="text-2xs uppercase tracking-label text-on-surface-variant font-medium mb-4">
        7-Day Forecast
      </p>
      <div className="flex flex-col gap-0.5">
        {daily.map((d, i) => (
          <DailyRow
            key={i}
            data={d}
            allMin={allMin}
            allMax={allMax}
            isFirst={i === 0}
          />
        ))}
      </div>
    </section>
  );
}
