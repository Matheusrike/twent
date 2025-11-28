
import { Button } from "@/components/web/Global/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import textCardsData from "./textCardsData.json";

const TextCardsCollection = () => {
    return (
        <div className="w-full flex justify-center py-20">
            <div className="container px-6 lg:px-8">
                <div className="w-full space-y-24 flex flex-col">
                    {textCardsData.map((feature, i) => (
                        <div
                            key={i}
                            className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full lg:even:flex-row-reverse"
                        >
                            {/* Image - Quadrada e Maior */}
                            <div className="relative overflow-hidden lg:w-3/5 aspect-square rounded-2xl h-100 bg-muted  border border-border/50 shadow-lg">
                                {/* <Image
                                    src={feature.image}
                                    width={800}
                                    height={800}
                                    alt={feature.title}
                                    className="absolute inset-0 h-full w-full object-cover"
                                /> */}
                            </div>

                            {/* Text Content */}
                            <div className="flex flex-col w-full lg:w-1/2 items-start space-y-6">

                                {/* Title - Maior */}
                                <h2 className="text-5xl md:text-6xl lg:text-5xl font-semibold text-primary mb-8 tracking-tight dark:text-white">
                                    {feature.title}
                                </h2>

                                {/* Description Text */}
                                <p className="text-lg md:text-md text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {feature.details}
                                </p>

                                {/* Button */}
                                <Button size="standartButton" variant="standartButton" className="w-100 h-auto h-12">
                                    Descubra a Coleção
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TextCardsCollection;