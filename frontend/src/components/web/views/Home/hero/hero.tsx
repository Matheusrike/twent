'use client'

import * as React from "react";
import { Button } from "@/components/web/Global/ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <div
      className="
        relative w-full h-screen 
        flex items-end md:items-center
        bg-[url('/img/web/home/bannerMobile.webp')] 
        md:bg-[url('/img/web/home/banner.png')] 
        bg-cover bg-center bg-no-repeat
        overflow-hidden
      "
    >
      {/* Overlay base */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10" />

      {/* Efeito de vinheta */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10" />

      <div className="relative z-20 p-6 md:px-12 lg:px-20 max-w-7xl w-full">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
            Explore a{" "}
            <span className="relative inline-block">
              <span className="text-primary relative z-10">Excelência</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/30 -z-10 blur-sm"></span>
            </span>
          </h1>
     
          <div className="flex items-center space-x-4 mb-8 group">
            <div className="w-16 h-0.5 bg-white transition-all duration-300 group-hover:w-24" />
            <span className="text-white font-medium tracking-wider uppercase text-sm md:text-base">
              Descubra nossa coleção exclusiva
            </span>
          </div>

          <Button 
            variant="standartButtonDark" 
            size="standartButton" 
            className="dark group hover:scale-105 transition-transform duration-300"
          >
            <Link href="/collection" className="flex items-center gap-2">
              Conheça mais
              <svg 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>

     
    </div>
  );
};

export default Hero;