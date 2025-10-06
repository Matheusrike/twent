import { useState } from "react";
import { Search, X, TrendingUp } from "lucide-react";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = [
    "Design inspirations",
    "React components",
    "Tailwind CSS tips",
    "Modern UI patterns"
  ];

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="relative w-full">
      {/* Main Search Bar */}
      <div
        className={`relative bg-background border border-border rounded-lg transition-all duration-200 ${
          isFocused ? "shadow-lg" : "shadow"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Search Icon */}
          <Search className="text-muted-foreground" size={20} />

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Pesquisar..."
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none "
          />

          {/* Clear Button */}
          {query && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-accent rounded-full transition-colors cursor-pointer"
            >
              <X className="text-muted-foreground dark:text-white" size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && !query && (
        <div className="absolute w-full mt-2 bg-background border border-border rounded-lg shadow-lg">
          <div className="p-2">
            <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground text-sm">
              <TrendingUp size={16} />
              <span>Sugestões populares</span>
            </div>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="w-full text-left px-3 py-2 text-foreground hover:bg-accent rounded transition-colors flex items-center gap-3 z-50"
                onClick={() => setQuery(suggestion)}
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