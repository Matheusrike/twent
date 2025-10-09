"use client";

import { Button } from "@/components/web/Global/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/web/views/Collection/filter/dropdown/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface DropdownMenuWithCheckboxesProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (option: string, checked: boolean) => void;
}

export default function DropdownMenuWithCheckboxes({
  label,
  options,
  selected,
  onChange,
}: DropdownMenuWithCheckboxesProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-background border border-border text-foreground hover:bg-accent dark:bg-black dark:hover:bg-zinc-700">
          {label}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt}
            checked={selected.includes(opt)}
            onCheckedChange={(checked) => onChange(opt, checked)}
            onSelect={(e) => e.preventDefault()}
          >
            {opt}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}