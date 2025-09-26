'use client'

import * as React from "react";
import { Button } from "@/components/web/Global/ui/button";

const Hero = () => {
  return (
    <div
      className="
        relative w-full min-h-screen flex items-end
        bg-[url('/img/home/bannerMobile.webp')] 
        md:bg-[url('/img/home/banner.png')] 
        bg-cover bg-center bg-no-repeat
      "
    >
      {/*blur*/}
      <div className="absolute inset-0 " />

      {/* button and text */}
      <div className="relative z-10 p-6 md:p-12 max-w-lg">
        <h1 className="text-white text-3xl md:text-6xl font-bold mb-4">
          Explore a excelência
        </h1>
        <p className="text-white/80 text-lg md:text-3xl mb-6">
          Descubra nossa coleção exclusiva de relógios de luxo.
        </p>
        <Button variant="standartButtonDark" size="standartButton" className="dark" >
          Conheça mais
        </Button>
      </div>
    </div>
  );
};

export default Hero;
