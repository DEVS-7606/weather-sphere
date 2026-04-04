import type { HourlyForecast as HourlyForecastType } from "@/domain/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import HourlyItem from "@/components/molecules/HourlyItem";

interface Props {
  hourly: HourlyForecastType[];
}

export default function HourlyForecast({ hourly }: Props) {
  return (
    <section className="rounded-3xl p-6 sm:p-8 bg-surface-low/70 backdrop-blur-3xl border border-white/4 shadow-hud min-w-0">
      <p className="text-2xs uppercase tracking-label text-on-surface-variant font-medium mb-4">
        Hourly Forecast
      </p>
      <ScrollArea className="w-full">
        <div className="flex items-center gap-2 mb-6">
          {hourly.map((h, i) => (
            <HourlyItem key={i} data={h} isNow={i === 0} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
