import { Button } from "@/components/web/Global/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/web/Global/Navbar/dropdown-language.-sheet";

// Flag Icons
import "flag-icons/css/flag-icons.min.css";
// Lucide Icons
import { Globe } from "lucide-react";
// Flag data import
import flagData from './json/languageSelectorData.json' assert { type: "json" };

export default function DropdownLanguageSelector() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Select language */}
        <Button variant="languageButton" size='languageButton'>
          <Globe />
          <h1>Idioma</h1>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {flagData.map((flag, i) => (
            <Button key={i} variant='setLanguageButton' size='default' >
              <span className={flag.flagIcon}></span>
              <h1>{flag.flagName}</h1>
            </Button>
          ))}
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
