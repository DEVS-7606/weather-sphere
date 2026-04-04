import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import type { GeoResult } from "@/domain/types";
import { searchCities } from "@/services/weatherApi";

interface Props {
  onSelect: (result: GeoResult) => void;
}

export default function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoResult[]>([]);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (value.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      const data = await searchCities(value);
      setResults(data);
      setOpen(data.length > 0);
    }, 300);
  };

  const handleSelect = (r: GeoResult) => {
    setQuery("");
    setResults([]);
    setOpen(false);
    onSelect(r);
  };

  return (
    <div className="relative w-full sm:max-w-xs lg:max-w-sm" ref={wrapperRef}>
      <div className="relative flex items-center w-full bg-surface-mid/40 border border-white/5 rounded-full px-4 transition-all duration-300 focus-within:bg-surface-mid/80 focus-within:border-cyan/50 focus-within:shadow-glow-cyan">
        <MapPin className="h-4 w-4 text-on-surface-variant shrink-0" />
        <input
          type="text"
          placeholder="Search city, state, country..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="w-full px-3 py-2 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none"
        />
      </div>
      {open && (
        <div
          className="absolute top-full mt-2 left-0 right-0 z-50 rounded-xl overflow-hidden"
          style={{
            background: "#141f38e8",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            boxShadow: "0 40px 60px -10px #00000026",
          }}
        >
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelect(r)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-400 cursor-pointer hover:bg-surface-bright/50"
              style={{ transitionTimingFunction: "var(--ease-atmo)" }}
            >
              <MapPin className="h-4 w-4 text-on-surface-variant shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-on-surface">{r.name}</span>
                <span className="text-on-surface-variant ml-1.5 text-xs">
                  {[r.admin1, r.country].filter(Boolean).join(", ")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
