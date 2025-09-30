import { Button } from "@/components/web/Global/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import textCardsData from "./textCardsData.json";

const TextCards = () => {
  return (
    <div className="min-h-screen flex container">
      <div className="w-full py-10 px-6 flex flex-col justify-between">
        <div className="mt-8 w-full mx-auto space-y-20 flex flex-col">
          {textCardsData.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col lg:flex-row items-center gap-y-6 gap-x-15 w-full lg:even:flex-row-reverse"
            >
              {/* Image */}
              <div
                className="relative overflow-hidden w-full md:basis-7/12 lg:basis-1/2 
                aspect-[4/2] bg-muted rounded-xl border border-border/50 shadow-m"
              >
                <Image
                  src={feature.image}
                  width={800}
                  height={400}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="md:order-1 flex flex-col w-full lg:basis-1/2 items-start shrink-0 px-4 md:px-6 lg:px-8 mt-4 lg:mt-0">
                <span className="uppercase font-medium text-sm text-muted-foreground">
                  {feature.category}
                </span>
                <h4 className="my-3 text-2xl font-semibold tracking-tight dark:text-white">
                  {feature.title}
                </h4>
                <p className="text-base md:text-md lg:text-md font-semibold md:font-bold dark:text-gray-300 tracking-wider md:tracking-widest mb-2 md:mb-3 lg:mb-4 opacity-80 hover:opacity-100 transition-opacity duration-200">
                  {feature.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextCards;
