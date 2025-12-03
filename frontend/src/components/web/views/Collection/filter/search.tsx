import { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp } from "lucide-react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchInput({ onSearch, placeholder = "Pesquisar..." }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    "Design inspirations",
    "React components",
    "Tailwind CSS tips",
    "Modern UI patterns"
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query.trim());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Bar Container */}
      <div
        className={`relative bg-background/70 backdrop-blur-md border-none rounded-xl transition-all duration-300 ${
          isFocused ? "shadow-2xl ring-2 ring-primary/30 scale-[1.02]" : "shadow-md"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-5 h-12 w-180">
          <Search className="text-muted-foreground" size={20} />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-base"
          />

          {query && (
            <button
              onClick={handleClear}
              className="p-1.5 hover:bg-accent transition-colors cursor-pointer"
            >
              <X className="text-muted-foreground" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && !query && (
        <div className="absolute w-full mt-3 bg-background/80 backdrop-blur-xl border-none rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
          <div className="p-3">
            <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground text-sm opacity-80">
              <TrendingUp size={16} />
              <span>Sugestões populares</span>
            </div>

            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="w-full text-left px-4 py-2 text-foreground hover:bg-accent/60 backdrop-blur-sm rounded-lg transition-colors flex items-center gap-3"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Search size={16} className="text-muted-foreground" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
