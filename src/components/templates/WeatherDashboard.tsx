import type { WeatherData } from "@/domain/types";
import Spinner from "@/components/atoms/Spinner";
import WeatherHero from "@/components/organisms/WeatherHero";
import HourlyForecast from "@/components/organisms/HourlyForecast";
import DailyForecast from "@/components/organisms/DailyForecast";
import {
  DetailGridTop,
  DetailGridBottom,
} from "@/components/organisms/DetailGrid";

interface Props {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  compact?: boolean;
}

export default function WeatherDashboard({
  weather,
  loading,
  error,
  compact = false,
}: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <Spinner />
        <p className="text-on-surface-variant text-sm">Loading weather...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="w-full flex-col flex items-center pointer-events-none overflow-x-hidden pt-4 pb-24">
      {/* 
        GPU-Accelerated Flex Grid Layout.
        On lg+ screens, items start in the center (gap-6) and use transform to slide outward.
      */}
      <div className="w-full max-w-dashboard flex flex-col xl:flex-row justify-center items-center xl:items-start gap-6 px-5 sm:px-8 relative z-10">
        {/* Left Col */}
        <div
          className={`flex flex-col gap-4 pointer-events-auto w-full xl:w-dashboard-col transition-transform duration-1200 ease-hud ${compact ? "dashboard-col-compact-left" : ""}`}
        >
          <WeatherHero weather={weather} compact={compact} />
          <HourlyForecast hourly={weather.hourly} />

          {/* Bottom details shift into Left Col when compact */}
          <div
            className={`transition-opacity duration-1200 ${compact ? "opacity-100" : "opacity-0 hidden"} mt-4`}
          >
            {compact && <DetailGridBottom weather={weather} compact={true} />}
          </div>
        </div>

        {/* Right Col */}
        <div
          className={`flex flex-col gap-4 pointer-events-auto w-full xl:w-dashboard-col transition-transform duration-1200 ease-hud ${compact ? "dashboard-col-compact-right" : ""}`}
        >
          <DailyForecast daily={weather.daily} compact={compact} />
          <DetailGridTop weather={weather} compact={compact} />
        </div>
      </div>

      {/* Full Width Bottom Section (Only Visible when !compact) */}
      <div
        className={`w-full max-w-dashboard pointer-events-auto transition-opacity duration-1200 px-5 sm:px-8 mt-6 ${compact ? "opacity-0 hidden" : "opacity-100 block"}`}
      >
        {!compact && <DetailGridBottom weather={weather} compact={false} />}
      </div>
    </div>
  );
}
