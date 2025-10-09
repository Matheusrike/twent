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
      "
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/10 to-transparent z-10" />

      <div className="relative z-20 p-6 md:px-12 lg:px-20 max-w-7xl w-full">
        <div className="max-w-2xl">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Explore a <span className="text-primary">Excelência</span>
          </h1>
     
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-0.5 bg-primary" />
            <span className="text-primary font-medium tracking-wider uppercase">Descubra nossa coleção exclusiva</span>
          </div>
          <Button variant="standartButtonDark" size="standartButton" className="dark">
            <Link href="/collection">
              Conheça mais
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;