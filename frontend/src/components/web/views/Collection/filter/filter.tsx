"use client";

import { useState } from "react";
import { Table2, List, X } from "lucide-react";
import DropdownMenuWithCheckboxes from "./dropdown/dropdown";
import SearchInput from "./search";

export default function FiltersSection() {
  const [categories, setCategories] = useState<string[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
      (option: string, checked: boolean) => {
        setter((prev) =>
          checked ? [...prev, option] : prev.filter((o) => o !== option)
        );
      };

  const activeFilters = [...categories, ...prices, ...brands, ...materials];

  return (
    <section id="filters" className=" py-8 container ">
      <div className="max-w-8xl mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* search input */}
          <div className="flex items-center gap-4 w-full">
            <SearchInput />
          </div>
           
          {/* Dropdowns */}
          <div className="flex flex-wrap gap-4">
            <DropdownMenuWithCheckboxes
              label="Categories"
              options={["Sports Watches", "Dress Watches", "Diving Watches", "Chronographs"]}
              selected={categories}
              onChange={handleChange(setCategories)}
            />
            <DropdownMenuWithCheckboxes
              label="Price Range"
              options={["$5,000 - $10,000", "$10,000 - $25,000", "$25,000 - $50,000", "$50,000+"]}
              selected={prices}
              onChange={handleChange(setPrices)}
            />
            <DropdownMenuWithCheckboxes
              label="Brand"
              options={["Chronos Elite", "Chronos Sport", "Chronos Heritage", "Chronos Limited"]}
              selected={brands}
              onChange={handleChange(setBrands)}
            />
            <DropdownMenuWithCheckboxes
              label="Material"
              options={["Stainless Steel", "Gold", "Titanium", "Ceramic"]}
              selected={materials}
              onChange={handleChange(setMaterials)}
            />
          </div>


        </div>

        {/* active filter */}
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
                    setCategories((prev) => prev.filter((f) => f !== filter));
                    setPrices((prev) => prev.filter((f) => f !== filter));
                    setBrands((prev) => prev.filter((f) => f !== filter));
                    setMaterials((prev) => prev.filter((f) => f !== filter));
                  }}
                />
              </span>
            ))}
            {activeFilters.length > 0 && (
              <button
                className="text-muted-foreground hover:text-gray-400 hover:dark:text-muted text-sm font-medium cursor-pointer"
                onClick={() => {
                  setCategories([]);
                  setPrices([]);
                  setBrands([]);
                  setMaterials([]);
                }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
