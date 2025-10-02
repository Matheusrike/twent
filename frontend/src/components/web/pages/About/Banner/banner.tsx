'use client'
import BannerImage from "./image";
import * as React from "react";

const Hero = () => {
  return (
    <div
      className="
        relative w-full min-h-screen flex flex-col items-center justify-center
        bg-[url('/img/web/about/aboutBanner.png')]
        bg-cover bg-center bg-no-repeat
      "
    >
      {/* blur*/}
      <div className="absolute inset-0 bg-black/30" />

      {/* text banner */}
      <div className="relative z-10 text-center px-6">
        <div>
          <BannerImage />
        </div>
        <p className="mt-4 text-lg md:text-xl text-white max-w-2xl mx-auto">
          Conheça nossa história, essência e valores que nos guiam.
        </p>
      </div>
    </div>
  );
};

export default Hero;
