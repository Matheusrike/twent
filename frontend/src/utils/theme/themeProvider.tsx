'use client';
import { useEffect } from "react";

export default function DarkModeProvider() {
  useEffect(() => {
    const isManager = document.body.dataset.layout === "manager";
    if (isManager) {
      document.documentElement.classList.remove("dark");
      return;
    }

    const darkMode =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", darkMode);
  }, []);

  return null;
}
