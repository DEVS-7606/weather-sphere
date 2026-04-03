import { useState, useRef, useEffect, type FormEvent } from "react";
import type { Message } from "./types";
import { fetchWeather } from "./weatherApi";
import { detectIntent, extractCity, buildResponse } from "./chatLogic";

let nextId = 1;

const WELCOME: Message = {
  id: nextId++,
  sender: "bot",
  text: "Hey! Ask me about the weather in any city 🌤️",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnread(0);
    }
  }, [messages, open]);

  const addMsg = (msg: Omit<Message, "id">) => {
    const newMsg = { ...msg, id: nextId++ };
    setMessages((prev) => [...prev, newMsg]);
    if (!open) setUnread((u) => u + 1);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    addMsg({ sender: "user", text });

    const city = extractCity(text);
    if (!city) {
      addMsg({
        sender: "bot",
        text: 'Try something like "temperature in Paris" or "weather in Tokyo".',
      });
      return;
    }

    setLoading(true);
    try {
      const weather = await fetchWeather(city);
      const intent = detectIntent(text);
      const response = buildResponse(intent, weather);
      addMsg({
        sender: "bot",
        text: response,
        weatherCard: intent === "full" ? weather : undefined,
      });
    } catch {
      addMsg({
        sender: "bot",
        text: `Couldn't find weather for "${city}". Check the city name and try again.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <>
      {/* Floating button */}
      <button
        className="chat-fab"
        onClick={() => {
          setOpen(!open);
          if (!open) setUnread(0);
        }}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? "✕" : "💬"}
        {!open && unread > 0 && <span className="chat-badge">{unread}</span>}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chat-panel">
          <div className="chat-panel-header">
            <span>🌤️ Weather Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </div>

          <div className="chat-panel-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg ${msg.sender}`}>
                {msg.text.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < msg.text.split("\n").length - 1 && <br />}
                  </span>
                ))}
                {msg.weatherCard && (
                  <div className="chat-weather-mini">
                    <strong>{msg.weatherCard.temp}°C</strong> · Feels{" "}
                    {msg.weatherCard.feelsLike}°C · 💧{msg.weatherCard.humidity}
                    % · 💨{msg.weatherCard.windSpeed} km/h
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot">
                <span className="chat-typing">●&nbsp;●&nbsp;●</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form className="chat-panel-input" onSubmit={onSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about weather..."
              disabled={loading}
              autoComplete="off"
            />
            <button type="submit" disabled={loading || !input.trim()}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
