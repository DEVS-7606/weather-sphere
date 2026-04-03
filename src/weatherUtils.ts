const WMO: Record<number, [string, string]> = {
  0: ["☀️", "Clear sky"],
  1: ["🌤️", "Mainly clear"],
  2: ["⛅", "Partly cloudy"],
  3: ["☁️", "Overcast"],
  45: ["🌫️", "Foggy"],
  48: ["🌫️", "Rime fog"],
  51: ["🌦️", "Light drizzle"],
  53: ["🌦️", "Moderate drizzle"],
  55: ["🌧️", "Dense drizzle"],
  61: ["🌧️", "Slight rain"],
  63: ["🌧️", "Moderate rain"],
  65: ["🌧️", "Heavy rain"],
  66: ["🌨️", "Freezing rain"],
  67: ["🌨️", "Heavy freezing rain"],
  71: ["❄️", "Slight snow"],
  73: ["❄️", "Moderate snow"],
  75: ["❄️", "Heavy snow"],
  77: ["🌨️", "Snow grains"],
  80: ["🌦️", "Slight showers"],
  81: ["🌧️", "Moderate showers"],
  82: ["⛈️", "Violent showers"],
  85: ["🌨️", "Slight snow showers"],
  86: ["🌨️", "Heavy snow showers"],
  95: ["⛈️", "Thunderstorm"],
  96: ["⛈️", "Thunderstorm with hail"],
  99: ["⛈️", "Thunderstorm with heavy hail"],
};

export function weatherIcon(code: number): string {
  return WMO[code]?.[0] ?? "🌡️";
}

export function weatherDescription(code: number): string {
  return WMO[code]?.[1] ?? "Unknown";
}

export function windDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatHour(isoString: string): string {
  const d = new Date(isoString);
  const h = d.getHours();
  if (h === 0) return "12 AM";
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

export function formatDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function uvLabel(uv: number): string {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}

export function uvColor(uv: number): string {
  if (uv <= 2) return "#4caf50";
  if (uv <= 5) return "#ffeb3b";
  if (uv <= 7) return "#ff9800";
  if (uv <= 10) return "#f44336";
  return "#9c27b0";
}
