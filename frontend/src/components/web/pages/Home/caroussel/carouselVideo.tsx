"use client";

import * as React from "react";
import { Video } from "./video";

import { Card, CardContent } from "@/components/web/pages/Home/caroussel/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/web/pages/Home/caroussel/carousel-sheet";

type CarouselWithProgressProps = {
  setApi?: (api: CarouselApi) => void;
};

export const CarouselWithProgress = ({ setApi }: CarouselWithProgressProps) => {
  return (
    <Carousel setApi={setApi} className="w-full h-full">
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index}>
            <Card className="relative">
              <CardContent className="items-center justify-center">
                <Video />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
