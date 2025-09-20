'use client'
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";
import { SunIcon, MoonIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from './input';



const Navbar = () => {

  
  return (
    <div className="bg-muted">
      <nav className="h-16 bg-background relative">
        <div className="h-full flex items-center justify-between w-full mx-auto px-4 sm:px-6 lg:px-8">

          {/* Dark Mode And Search */}
          <div className="flex items-center gap-5">

            {/* Language */}
            <div className="flex items-center gap-2">
             
            </div>

            {/* search input */}
            <Input type='text' placeholder='Pesquisar' />
          </div>

          {/* Menu*/}
          <div className="flex items-center gap-2">
            <NavigationSheet />
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
            <Logo />
          </div>

        </div>
      </nav>
    </div>


  );
};

export default Navbar;


