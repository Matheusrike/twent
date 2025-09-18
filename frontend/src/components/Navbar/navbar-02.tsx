'use client'
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavigationSheet } from "./navigation-sheet";
import { SunIcon, MoonIcon } from "lucide-react";
import { useState, useEffect } from "react";


const Navbar = () => {

  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Sincroniza o estado com o localStorage ou classe inicial
    if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    } else {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    }
  }, [])

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark")
      localStorage.theme = "light"
    } else {
      document.documentElement.classList.add("dark")
      localStorage.theme = "dark"
    }
    setIsDark(!isDark)
  }

  return (
    <div className="bg-muted">
      <nav className="h-16 bg-background border-b">
        <div className="h-full flex items-center justify-between w-full mx-auto px-4 sm:px-6 lg:px-8">

          {/* Sibebar menu  */}
          <div className="flex items-center gap-8 h-full">
            <NavigationSheet />
          </div>


          {/* Logo Section */}
          <div className="flex items-center gap-8 h-full">
            <Logo />
          </div>

          {/* dark mode */}
          <div className="flex items-center h-full text-6xl gap-2">
            <Button size="headericon" variant="menu" onClick={toggleDarkMode} >
              {isDark ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </Button>
          </div>

        </div>
      </nav>
    </div>
  );
};

export default Navbar;


