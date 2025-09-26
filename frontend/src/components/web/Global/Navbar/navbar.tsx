'use client'
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";
import DropdownLanguageSelector from "./dropdownLanguageSelector";
import { Input } from './input';
import Link from "next/link";



const Navbar = () => {
  return (
    <div className="bg-muted w-full  z-50">
      <nav className="h-16 bg-background relative">
        <div className="h-full w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center">

          {/*Menu And Search */}
          <div className="flex items-center gap-5">
            {/* Menu */}
            <NavigationSheet />

            {/* search input */}
            <Input type="text" placeholder="Pesquisar" />
          </div>

          {/*  Logo */}
          <div className="flex justify-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          {/*  Set Language */}
          <div className="flex justify-end items-center gap-2">
            <div className="flex items-center gap-2">
              <DropdownLanguageSelector />
            </div>
          </div>

        </div>
      </nav>
    </div>
  );
};

export default Navbar;


