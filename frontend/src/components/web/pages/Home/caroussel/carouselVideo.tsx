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
import { CarouselDots } from "../caroussel/progress";

type CarouselWithProgressProps = {
  setApi?: (api: CarouselApi) => void;
};

export const CarouselWithProgress = ({ setApi }: CarouselWithProgressProps) => {
  const [api, setLocalApi] = React.useState<CarouselApi>(); 
  const [current, setCurrent] = React.useState(0); 
  const [count, setCount] = React.useState(0); 

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1); 

    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));

    const interval = setInterval(() => { 
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 12000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <Carousel setApi={(carouselApi) => { setLocalApi(carouselApi); if (setApi) setApi(carouselApi); }} className="w-full h-full">
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
      <CarouselDots api={api} current={current} count={count} />
    </Carousel>
  );
};
