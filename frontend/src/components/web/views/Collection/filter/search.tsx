
import { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp } from "lucide-react";

interface SearchInputProps {
  onSearch: (query: string) => void;        // Nova prop: avisa o pai qual é a busca atual
  placeholder?: string;
}

export default function SearchInput({ 
  onSearch, 
  placeholder = "Pesquisar..." 
}: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    "Design inspirations",
    "React components",
    "Tailwind CSS tips",
    "Modern UI patterns"
  ];

  // Dispara a busca sempre que o usuário digita (debounced para performance)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query.trim());
    }, 300); // 300ms de debounce

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleClear = () => {
    setQuery("");
    onSearch(""); // limpa a busca imediatamente
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setIsFocused(false); // fecha o dropdown ao escolher uma sugestão
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Main Search Bar */}
      <div
        className={`relative bg-background border border-border rounded-lg transition-all duration-200 ${
          isFocused ? "shadow-lg ring-2 ring-primary/20" : "shadow"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Search Icon */}
          <Search className="text-muted-foreground" size={20} />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none"
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

      {/* Suggestions Dropdown - só aparece quando está vazio e focado */}
      {isFocused && !query && (
        <div className="absolute w-full mt-2 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground text-sm">
              <TrendingUp size={16} />
              <span>Sugestões populares</span>
            </div>
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="w-full text-left px-3 py-2 text-foreground hover:bg-accent rounded transition-colors flex items-center gap-3"
                onMouseDown={(e) => e.preventDefault()} // evita blur antes do click
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