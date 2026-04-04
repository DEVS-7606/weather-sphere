import { useState, useRef, useEffect, type FormEvent } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Message } from "@/domain/types";
import { fetchWeather } from "@/services/weatherApi";
import { detectIntent, extractCity, buildResponse } from "@/services/chatLogic";
import ChatBubble from "@/components/atoms/ChatBubble";

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
        text: `Couldn't find weather for "${city}". Check the city name.`,
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
      {/* FAB — primary glow instead of shadow */}
      <Button
        size="icon"
        onClick={() => {
          setOpen(!open);
          if (!open) setUnread(0);
        }}
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 h-13 w-13 sm:h-14 sm:w-14 rounded-full z-1000 cursor-pointer border-0"
        style={{
          background: "linear-gradient(135deg, #4cd6fe, #21bde4)",
          boxShadow: "0 0 24px #4cd6fe18, 0 4px 20px #00000030",
        }}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-2xs font-bold rounded-full bg-destructive text-on-surface">
            {unread}
          </span>
        )}
      </Button>

      {/* Chat Panel — glassmorphic */}
      {open && (
        <div
          className="fixed z-999 flex flex-col inset-0 sm:inset-auto sm:bottom-20 sm:right-5 sm:w-96 sm:h-130 lg:w-100 lg:h-140 sm:rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{
            background: "#091328e8",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            boxShadow: "0 40px 60px -10px #00000026",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-surface-mid/80 backdrop-blur-md border-b border-white/5">
            <span className="font-semibold text-sm text-on-surface">
              🌤️ Weather Assistant
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="h-7 w-7 text-on-surface-variant hover:text-on-surface cursor-pointer"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
            <div className="flex flex-col gap-2">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              {loading && (
                <div className="self-start px-3 py-2 rounded-xl bg-surface-high text-on-surface-variant text-sm animate-pulse">
                  ● ● ●
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input — minimalist, ghost border */}
          <form
            onSubmit={onSubmit}
            className="flex gap-2 p-3 shrink-0 bg-surface-mid/40"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about weather..."
              disabled={loading}
              autoComplete="off"
              className="rounded-full bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant"
              style={{ borderColor: "#40485d33" }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !input.trim()}
              className="rounded-full shrink-0 h-9 w-9 cursor-pointer border-0"
              style={{
                background: "linear-gradient(135deg, #4cd6fe, #21bde4)",
              }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
