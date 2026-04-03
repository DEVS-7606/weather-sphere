import { useState, useRef, useEffect } from "react";
import type { GeoResult } from "./types";
import { searchCities } from "./weatherApi";

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
    <div className="search-wrapper" ref={wrapperRef}>
      <input
        type="text"
        className="search-input"
        placeholder="Search city, state, country..."
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
      />
      {open && (
        <ul className="search-dropdown">
          {results.map((r, i) => (
            <li key={i} onClick={() => handleSelect(r)}>
              <span className="search-city">{r.name}</span>
              <span className="search-meta">
                {[r.admin1, r.country].filter(Boolean).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
