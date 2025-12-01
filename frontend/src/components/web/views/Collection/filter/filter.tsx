"use client";

import { useState } from "react";
import { Table2, List, X } from "lucide-react";
import DropdownMenuWithCheckboxes from "./dropdown/dropdown";
import SearchInput from "./search";
import CollectionHero from "../hero/hero"

export default function FiltersSection() {
  const [collections, setCollections] = useState<string[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // ← ESTADO DA BUSCA

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (option: string, checked: boolean) => {
      setter((prev) =>
        checked ? [...prev, option] : prev.filter((o) => o !== option)
      );
    };

  const activeFilters = [...collections, ...prices];

  return (
    <section id="filters" className="py-8 container">
      <div className="max-w-8xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* search input */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <SearchInput onSearch={setSearchQuery} /> {/* ← PASSA A FUNÇÃO */}
          </div>
           
          {/* Dropdowns */}
          <div className="flex flex-wrap gap-4">
            <DropdownMenuWithCheckboxes
              label="Collections"
              options={["Heritage", "Diamond", "Royal", "Limited"]}
              selected={collections}
              onChange={handleChange(setCollections)}
            />
            <DropdownMenuWithCheckboxes
              label="Price Range"
              options={["$5,000 - $10,000", "$10,000 - $25,000", "$25,000 - $50,000", "$50,000+"]}
              selected={prices}
              onChange={handleChange(setPrices)}
            />
          </div>
        </div>

        {/* active filters */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span
                key={filter}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {filter}
                <X
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => {
                    setCollections((prev) => prev.filter((f) => f !== filter));
                    setPrices((prev) => prev.filter((f) => f !== filter));
                  }}
                />
              </span>
            ))}
            {activeFilters.length > 0 && (
              <button
                className="text-muted-foreground hover:text-gray-400 hover:dark:text-muted text-sm font-medium cursor-pointer"
                onClick={() => {
                  setCollections([]);
                  setPrices([]);
                }}
              >
                Limpar tudo
              </button>
            )}
          </div>
        </div>

        {/* AQUI VEM O GRID COM A BUSCA JÁ FUNCIONANDO */}
        <div className="mt-12">
          <CollectionHero searchQuery={searchQuery} />
        </div>
      </div>
    </section>
  );
}