import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/useChat";
import ChatBubble from "@/components/atoms/ChatBubble";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { messages, loading, sendMessage } = useChat();

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnread(0);
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const text = input;
    setInput("");
    if (!open) setUnread((u) => u + 1);
    sendMessage(text);
  };

  const renderFab = () => (
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
      {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      {!open && unread > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-2xs font-bold rounded-full bg-destructive text-on-surface">
          {unread}
        </span>
      )}
    </Button>
  );

  const renderHeader = () => (
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
  );

  const renderMessages = () => (
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
  );

  const renderInput = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
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
        style={{ background: "linear-gradient(135deg, #4cd6fe, #21bde4)" }}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );

  return (
    <>
      {renderFab()}
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
          {renderHeader()}
          {renderMessages()}
          {renderInput()}
        </div>
      )}
    </>
  );
}
