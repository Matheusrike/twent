import { Button } from "@/components/web/Global/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import textCardsData from "../textCardsData.json";

const TextCards = () => {
  return (
    <div className="min-h-screen flex container">
      <div className=" w-full py-10 px-6 flex flex-col justify-between">
        <div className=" mt-8 w-full mx-auto space-y-20 flex flex-col">
          {textCardsData.map((feature,i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-center gap-x-15 gap-y-6 md:even:flex-row-reverse"
            >
              {/* Image */}
              <div className="w-full aspect-[4/2] bg-muted rounded-xl border border-border/50 basis-1/2 relative overflow-hidden">
                <Image
                  src={feature.image}
                  width={800}
                  height={400}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="basis-1/2 shrink-0">
                <span className="uppercase font-medium text-sm text-muted-foreground">
                  {feature.category}
                </span>
                <h4 className="my-3 text-2xl font-semibold tracking-tight">
                  {feature.title}
                </h4>
                <p className="text-base md:text-base lg:text-md font-semibold md:font-bold dark:text-gray-300 tracking-wider md:tracking-widest mb-2 md:mb-3 lg:mb-4 opacity-80 hover:opacity-100 transition-opacity duration-200">
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
