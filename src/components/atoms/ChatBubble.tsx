import type { Message } from "@/domain/types";

export default function ChatBubble({ message }: { message: Message }) {
  return (
    <div
      className={`max-w-chat-bubble px-3 py-2 rounded-xl text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-200 ${
        message.sender === "bot"
          ? "self-start bg-surface-high text-on-surface/85 rounded-bl-sm"
          : "self-end rounded-br-sm text-on-surface"
      }`}
      style={message.sender === "user" ? { background: "#4cd6fe18" } : {}}
    >
      {message.text.split("\n").map((line, i) => (
        <span key={i}>
          {line}
          {i < message.text.split("\n").length - 1 && <br />}
        </span>
      ))}
      {message.weatherCard && (
        <div className="mt-2 p-2.5 rounded-lg bg-surface-low text-xs text-on-surface-variant">
          <strong className="text-on-surface">
            {message.weatherCard.temp}°C
          </strong>
          {" · Feels "}
          {message.weatherCard.feelsLike}°C
          {" · 💧"}
          {message.weatherCard.humidity}%{" · 💨"}
          {message.weatherCard.windSpeed} km/h
        </div>
      )}
    </div>
  );
}
