'use client'
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";
import DropdownLanguageSelector from "./dropdownLanguageSelector";
import { FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <div className="bg-muted w-full  z-50">
      <nav className="h-16 bg-background relative">
        <div className="h-full w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center">
          {/* left content */}
          <div className="flex items-center gap-2">
            <DropdownLanguageSelector />
            <Link href="/maps">
              <Button variant="languageButton" size="languageButton" className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-base" />
                <span className="text-sm font-medium hidden md:flex">Maps</span>
              </Button>
            </Link>
          </div>

          {/* center content */}
          <div className="flex justify-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/* right content */}
          <div className="flex justify-end items-center gap-2">
            <NavigationSheet />
          </div>
        </div>

      </nav>
    </div>
  );
};

export default Navbar;


