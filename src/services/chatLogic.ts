import type { Intent, WeatherData } from "@/domain/types";

export function detectIntent(text: string): Intent {
  const lower = text.toLowerCase();
  if (/temp/.test(lower)) return "temperature";
  if (/humid/.test(lower)) return "humidity";
  if (/wind/.test(lower)) return "wind";
  if (/feels?\s*like/.test(lower)) return "feels_like";
  if (/max|high/.test(lower)) return "max_temp";
  if (/min|low/.test(lower)) return "min_temp";
  return "full";
}

export function extractCity(text: string): string | null {
  // Try to extract city from common patterns first
  const directMatch = text.match(
    /(?:weather|temperature|temp|humidity|wind|forecast|report|conditions?)\s+(?:in|for|at|of|around|near)\s+(.+)/i,
  );
  if (directMatch) {
    const city = directMatch[1].replace(/[?.!,]+$/, "").trim();
    if (city) return city.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Try "in <city>" pattern
  const inMatch = text.match(/\b(?:in|for|at|of)\s+(.+)/i);
  if (inMatch) {
    const city = inMatch[1].replace(/[?.!,]+$/, "").trim();
    if (city) return city.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Fallback: strip known words and see what's left
  let cleaned = text.toLowerCase().trim();
  const stripWords = [
    "what",
    "what's",
    "whats",
    "how",
    "how's",
    "hows",
    "is",
    "are",
    "the",
    "tell",
    "me",
    "give",
    "show",
    "get",
    "check",
    "current",
    "today",
    "todays",
    "today's",
    "right",
    "now",
    "outside",
    "full",
    "complete",
    "detailed",
    "weather",
    "temperature",
    "temp",
    "humidity",
    "wind",
    "speed",
    "feels",
    "like",
    "forecast",
    "report",
    "conditions",
    "condition",
    "of",
    "in",
    "for",
    "at",
    "around",
    "near",
    "please",
  ];

  cleaned = cleaned.replace(/[?.!,]/g, "");
  const words = cleaned.split(/\s+/).filter((w) => !stripWords.includes(w));
  if (words.length === 0) return null;

  const city = words.join(" ").trim();
  if (!city) return null;

  return city.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function buildResponse(intent: Intent, w: WeatherData): string {
  const loc = `${w.city}, ${w.country}`;

  switch (intent) {
    case "temperature":
      return `🌡️ The current temperature in ${loc} is ${w.temp}°C.\nIt ranges from a low of ${w.minTemp}°C to a high of ${w.maxTemp}°C today.`;
    case "humidity":
      return `💧 The humidity in ${loc} is ${w.humidity}%.\nIt feels like ${w.feelsLike}°C right now.`;
    case "wind":
      return `💨 Wind in ${loc} is blowing at ${w.windSpeed} km/h, direction ${w.windDeg}°.`;
    case "feels_like":
      return `🤔 It feels like ${w.feelsLike}°C in ${loc}, while the actual temperature is ${w.temp}°C.`;
    case "max_temp":
      return `🔥 The high today in ${loc} is ${w.maxTemp}°C.`;
    case "min_temp":
      return `❄️ The low today in ${loc} is ${w.minTemp}°C.`;
    default:
      return `Here's the full weather for ${loc}:`;
  }
}
