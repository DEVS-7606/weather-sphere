/**
 * Extracts a location name (city, country, state, district, etc.)
 * from a natural-language weather query.
 * Returns null if no location can be identified.
 */
export function extractLocation(text: string): string | null {
  // Pattern: "weather/forecast/etc. in/for/at <location>"
  const directMatch = text.match(
    /(?:weather|temperature|temp|humidity|wind|forecast|report|conditions?)\s+(?:in|for|at|of|around|near)\s+(.+)/i,
  );
  if (directMatch) {
    const location = directMatch[1].replace(/[?.!,]+$/, "").trim();
    if (location) return location.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Pattern: "in/for/at/of <location>"
  const inMatch = text.match(/\b(?:in|for|at|of)\s+(.+)/i);
  if (inMatch) {
    const location = inMatch[1].replace(/[?.!,]+$/, "").trim();
    if (location) return location.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Fallback: strip known filler words and treat what's left as the location
  const stripWords = new Set([
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
  ]);

  const words = text
    .toLowerCase()
    .replace(/[?.!,]/g, "")
    .split(/\s+/)
    .filter((w) => !stripWords.has(w));

  if (words.length === 0) return null;

  const location = words.join(" ").trim();
  if (!location) return null;

  return location.replace(/\b\w/g, (c) => c.toUpperCase());
}
