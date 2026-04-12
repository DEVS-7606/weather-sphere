import { useState, useRef, useCallback } from "react";
import type { Message, WeatherData } from "@/domain/types";
import { fetchWeather } from "@/services/weatherApi";
import { extractLocation } from "@/services/chatLogic";
import { chatWithOllama } from "@/services/ollamaApi";

let nextId = 1;

const WELCOME: Message = {
  id: nextId++,
  sender: "bot",
  text: "Hey! Ask me about the weather in any place 🌤️",
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [loading, setLoading] = useState(false);
  const conversationRef = useRef<{ role: string; content: string }[]>([]);
  const lastWeatherRef = useRef<WeatherData | null>(null);

  const addMsg = useCallback((msg: Omit<Message, "id">): Message => {
    const newMsg = { ...msg, id: nextId++ };
    setMessages((prev) => [...prev, newMsg]);
    return newMsg;
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      addMsg({ sender: "user", text });
      conversationRef.current.push({ role: "user", content: text });

      setLoading(true);
      try {
        const weather = await resolveWeather(text, lastWeatherRef.current);
        if (weather) lastWeatherRef.current = weather;

        const response = await chatWithOllama(
          text,
          weather,
          conversationRef.current.slice(-10),
        );

        conversationRef.current.push({ role: "assistant", content: response });

        const showCard = shouldShowWeatherCard(text, weather);

        addMsg({
          sender: "bot",
          text: response,
          weatherCard: showCard ? (weather ?? undefined) : undefined,
        });
      } catch {
        addMsg({
          sender: "bot",
          text: "Couldn't reach the AI assistant. Check your connection or configuration.",
        });
      } finally {
        setLoading(false);
      }
    },
    [loading, addMsg],
  );

  return { messages, loading, sendMessage };
}

/** Try to extract a city from the message and fetch its weather */
async function resolveWeather(
  text: string,
  fallback: WeatherData | null,
): Promise<WeatherData | null> {
  const city = extractLocation(text);
  if (!city) return fallback;

  try {
    return await fetchWeather(city);
  } catch {
    return fallback;
  }
}

function shouldShowWeatherCard(
  text: string,
  weather: WeatherData | null,
): boolean {
  if (!weather) return false;
  return /weather|forecast|full|report|conditions?/i.test(text);
}
