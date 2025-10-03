'use client'
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";
import DropdownLanguageSelector from "./dropdownLanguageSelector";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="bg-muted w-full  z-50">
      <nav className="h-16 bg-background relative">
        <div className="h-full w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center">

          {/* Set Language */}
          <div className="flex items-center gap-5">
            <DropdownLanguageSelector />

          </div>

          {/*  Logo */}
          <div className="flex justify-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/*Menu And Search */}
          <div className="flex justify-end items-center gap-2">
            <NavigationSheet />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;


