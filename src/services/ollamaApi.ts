import type { WeatherData } from "@/domain/types";

function buildWeatherContext(weather: WeatherData): string {
  return [
    `Location: ${weather.city}, ${weather.country}`,
    `Temperature: ${weather.temp}°C (feels like ${weather.feelsLike}°C)`,
    `High: ${weather.maxTemp}°C, Low: ${weather.minTemp}°C`,
    `Humidity: ${weather.humidity}%`,
    `Wind: ${weather.windSpeed} km/h, direction ${weather.windDeg}°`,
    `Pressure: ${weather.pressure} hPa`,
    `Cloud cover: ${weather.cloudCover}%`,
    `Precipitation: ${weather.precipitation} mm`,
    `UV Index: ${weather.uvIndex}`,
    `Sunrise: ${weather.sunrise}, Sunset: ${weather.sunset}`,
  ].join("\n");
}

const SYSTEM_PROMPT = `You are a friendly weather assistant embedded in a weather dashboard app. 
You receive real-time weather data and answer the user's question based on it.
Keep responses concise (2-4 sentences max), use weather emojis where appropriate, and be conversational.
Only answer weather-related questions. If the user asks something unrelated, politely redirect them to weather topics.
Do not make up data — only use the weather data provided to you.`;

export async function chatWithOllama(
  userMessage: string,
  weather: WeatherData | null,
  conversationHistory: { role: string; content: string }[] = [],
): Promise<string> {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...conversationHistory,
  ];

  if (weather) {
    messages.push({
      role: "system",
      content: `Current weather data:\n${buildWeatherContext(weather)}`,
    });
  }

  messages.push({ role: "user", content: userMessage });

  // Proxied through Vite dev server / production reverse proxy
  // so the API key never reaches the browser
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    throw new Error(`Chat request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  // Ollama's native format uses data.message.content
  return (
    data.message?.content ??
    data.choices?.[0]?.message?.content ??
    "Sorry, I couldn't generate a response."
  );
}
