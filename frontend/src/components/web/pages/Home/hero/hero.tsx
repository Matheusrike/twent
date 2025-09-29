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
        bg-[url('/img/home/bannerMobile.webp')] 
        md:bg-[url('/img/home/banner.png')] 
        bg-cover bg-center bg-no-repeat
      "
    >

      <div className="absolute inset-0 md:bg-black/10" />

      <div className="relative z-10 p-6 md:px-12 max-w-lg md:max-w-2xl">
        <h1 className="text-white text-3xl md:text-8xl font-bold mb-4 md:uppercase md:leading-tight md:tracking-tight">
          Explore a<br className="hidden md:block" />excelência
        </h1>
        <p className="text-white/80 md:text-white/90 text-lg md:text-base mb-6 md:mb-8 md:max-w-md">
          Descubra nossa coleção exclusiva de relógios de luxo.
        </p>
        <Button variant="standartButtonDark" size="standartButton" className="dark">
          <Link href="/collection">
            Conheça mais
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Hero;