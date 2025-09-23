'use client'

import * as React from "react";
import { CarouselWithProgress } from "../caroussel/carouselVideo";
import { CarouselDots } from "../caroussel/progress";
import type { CarouselApi } from "../caroussel/carousel-sheet";

const Hero = () => {
  const [api, setApi] = React.useState<CarouselApi>();
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
    <div className="w-full md:h-screen relative">
      <CarouselWithProgress setApi={setApi} />
      <CarouselDots api={api} current={current} count={count} />
    </div>
  );
};

export default Hero;
