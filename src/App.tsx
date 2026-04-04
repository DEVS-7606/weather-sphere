import { useState, lazy, Suspense } from "react";
import { Globe } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import SearchBar from "@/components/molecules/SearchBar";
import WeatherDashboard from "@/components/templates/WeatherDashboard";
import ChatWidget from "@/components/organisms/ChatWidget";

const GlobeView = lazy(
  () => import(/* webpackChunkName: "globe" */ "@/features/globe/GlobeView"),
);
function App() {
  const { weather, loading, error, selectCity, selectLocation } = useWeather();
  const [globeActive, setGlobeActive] = useState(false);

  const handleGlobeToggle = () => {
    setGlobeActive(!globeActive);
  };

  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col bg-surface relative">
      <Suspense fallback={null}>
        <GlobeView
          active={globeActive}
          selectedLatitude={weather?.latitude ?? null}
          selectedLongitude={weather?.longitude ?? null}
          onLocationSelect={selectLocation}
        />
      </Suspense>

      <div className="absolute inset-0 pointer-events-none flex flex-col z-10">
        <header className="pointer-events-auto sticky top-0 z-50 flex flex-col sm:flex-row items-center justify-between gap-4 px-5 sm:px-8 py-4 bg-surface-low/60 backdrop-blur-3xl border-b border-white/4 shadow-header">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-linear-to-br from-cyan to-cyan-container shadow-logo">
              <Globe className="text-surface w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
              Weather<span className="text-cyan font-medium">Sphere</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <SearchBar onSelect={selectCity} />
            <button
              className={`globe-toggle-btn active`}
              onClick={handleGlobeToggle}
              title={globeActive ? "Close Globe" : "Open Globe"}
              aria-label={globeActive ? "Close Globe" : "Open Globe"}
            >
              <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Globe%20Showing%20Americas.png"
                alt="Globe"
                className={`w-6 h-6 drop-shadow-md transition-transform duration-600 ${globeActive ? "globe-icon-spin" : "hover:scale-110"}`}
              />
            </button>
          </div>
        </header>

        <div className="globe-layout flex-1 w-full pointer-events-none">
          <main
            className={`weather-panel pointer-events-none px-3 sm:px-5 lg:px-6 py-5 pb-24 mx-auto w-full ${globeActive ? "weather-panel-globe-active" : ""}`}
          >
            <div className="mx-auto flex justify-center w-full">
              <WeatherDashboard
                weather={weather}
                loading={loading}
                error={error}
                compact={globeActive}
              />
            </div>
          </main>
        </div>
      </div>

      <div className="pointer-events-auto relative z-20">
        <ChatWidget />
      </div>
    </div>
  );
}

export default App;
