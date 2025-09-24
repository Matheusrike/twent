"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { CarouselApi } from "./carousel-sheet"; 

type CarouselDotsProps = {
  api: CarouselApi | undefined;
  current: number;
  count: number;
};

export const CarouselDots = ({ api, current, count }: CarouselDotsProps) => {
  return (
    <div className="absolute left-[50%] top-[5%] -translate-x-1/2 flex gap-2 z-50">
    {Array.from({ length: count }).map((_, index) => (
      <button
        key={index}
        onClick={() => api?.scrollTo(index)}
        className={cn(
          "h-3 w-3 rounded-full border-2 transition-colors",
          current === index + 1
            ? "border-primary bg-primary"
            : "border-white bg-transparent"
        )}
      />
    ))}
  </div>
  
  
  );
};
