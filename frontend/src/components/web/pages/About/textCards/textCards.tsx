import { Button } from "@/components/web/Global/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import features from "../textCardsData.json"; 


const TextCards = () => {
  return (
    <div className="min-h-screen flex container">
      <div className=" w-full py-10 px-6 flex flex-col justify-between">
        <h2 className="text-4xl md:text-[2.75rem] md:leading-[1.2] font-semibold tracking-[-0.03em] sm:max-w-xl text-pretty sm:mx-auto sm:text-center dark:text-white">
          Strengthen Your Strategy
        </h2>
        <p className="mt-2 text-muted-foreground text-lg sm:text-xl sm:text-center dark:text-gray">
          Enhance your strategy with intelligent tools designed for success.
        </p>
        <div className=" mt-8 w-full mx-auto space-y-20 flex flex-col">
          {features.map((feature) => (
            <div
              key={feature.category}
              className="flex flex-col md:flex-row items-center gap-x-15 gap-y-6 md:even:flex-row-reverse"
            >
              {/* Image */}
              <div className="w-full aspect-[4/2] bg-muted rounded-xl border border-border/50 basis-1/2" />

              {/* Text */}
              <div className="basis-1/2 shrink-0">

                <span className="uppercase font-medium text-sm text-muted-foreground">
                  {feature.category}
                </span>
                <h4 className="my-3 text-2xl font-semibold tracking-tight dark:text-gray-300">
                  {feature.title}
                </h4>
                <p className="text-base md:text-base lg:text-md font-semibold md:font-bold dark:text-gray-300 tracking-wider md:tracking-widest mb-2 md:mb-3 lg:mb-4 opacity-80 hover:opacity-100 transition-opacity duration-200">{feature.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextCards;
