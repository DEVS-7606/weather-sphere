import type { Intent, WeatherData } from "./types";

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
  const patterns: RegExp[] = [
    /(?:what(?:'s| is| are)?|how(?:'s| is)?|tell me|give me|show me|get me|check)\s*/gi,
    /(?:the )?\s*(?:current|today'?s?|right now|now|outside)?\s*/gi,
    /(?:full |complete |detailed )?(?:weather|temperature|temp|humidity|wind speed|wind|feels? like|forecast|report|conditions?)\s*/gi,
    /(?:of|in|for|at|around|near)\s*/gi,
    /[?.!,]/g,
  ];

  let cleaned = text.toLowerCase().trim();
  for (const p of patterns) {
    cleaned = cleaned.replace(p, " ");
  }

  cleaned = cleaned.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;

  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
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
