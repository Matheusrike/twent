"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import DropdownMenuWithCheckboxes from "./dropdown/dropdown";
import SearchInput from "./search";
import CollectionHero from "../hero/hero";
import { useSearchParams } from "next/navigation";

export default function FiltersSection() {
  const [collections, setCollections] = useState<string[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [badgeOptions, setBadgeOptions] = useState<string[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
  async function fetchBadges() {
    try {
      const res = await fetch("/response/api/product/public?limit=9");
      const json = await res.json();

      const list =
        Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json?.data?.products)
          ? json.data.products
          : [];

      // Extrai nome da coleção e remove tudo que não seja string válida
      const validNames = list
        .map((p: any) => p?.collection?.name)
        .filter((n: unknown): n is string => typeof n === "string" && n.trim().length > 0);

      // Remove duplicatas — sempre string[]
      const names: string[] = Array.from(new Set(validNames));

      setBadgeOptions(names);
    } catch (error) {
      console.error("Erro ao carregar badges:", error);
      setBadgeOptions([]);
    }
  }

  fetchBadges();
}, []);

  // Ler filtro inicial da URL (collection ou category)
  useEffect(() => {
    const initial = searchParams?.get("collection") ?? searchParams?.get("category");
    if (initial && initial.trim().length > 0) {
      setCollections([initial]);
    }
  }, [searchParams]);


  // Função genérica para atualizar filtros
  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (option: string, checked: boolean) => {
      setter((prev) =>
        checked ? [...prev, option] : prev.filter((o) => o !== option)
      );
    };

  // Mostra os filtros ativos
  const activeFilters = [...collections, ...prices];

  return (
    <section id="filters" className="py-8 container">
      <div className="max-w-8xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Campo de busca */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <SearchInput onSearch={setSearchQuery} />
          </div>

          {/* Dropdowns */}
          <div className="flex flex-wrap gap-4">
            <DropdownMenuWithCheckboxes
              label="Coleções"
              options={badgeOptions}
              selected={collections}
              onChange={handleChange(setCollections)}
            />

            <DropdownMenuWithCheckboxes
              label="Faixa de preço"
              options={[
                "50.000 - 100.000",
                "100.000 - 200.000",
                "200.000 - 500.000",
                "500.000+",
              ]}
              selected={prices}
              onChange={handleChange(setPrices)}
            />
          </div>
        </div>

        {/* Filtros ativos */}
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
                className="text-muted-foreground hover:text-gray-400 text-sm font-medium cursor-pointer"
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

        {/* GRID */}
        <div className="mt-12">
          <CollectionHero
            searchQuery={searchQuery}
            selectedCategories={collections}
            selectedPrices={prices}
          />
        </div>
      </div>
    </section>
  );
}
