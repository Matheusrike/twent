'use client'
import Image from "next/image";
import { notFound } from "next/navigation";
import cardsDataTest from "@/components/web/pages/Collection/cardsDataTest.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/web/Global/ui/button";
import Link from "next/link";
import React from "react";
import { formatCurrency } from "@/utils/functions/formatCurrency";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CollectionIdHero({ params }: any) {
  const router = useRouter();
  const { id } = params;
  const item = cardsDataTest.items.find((item) => item.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="flex flex-col md:flex-row w-full h-screen">
        {/* image*/}
        <div className="md:w-1/2 h-full relative bg-black">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>

        {/* data content */}
        <div className="md:w-1/2 h-full flex flex-col  items-center px-12 py-15">

          {/* return to previous */}
          <div className="w-full h-auto flex justify-end-safe items-end-safe">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="w-full cursor-pointer sm:w-auto flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4 text-[#DE1A26]" />
              Voltar à página anterior
            </Button>
          </div>


          {/* info content */}
          <div className="flex flex-col items-start md:min-w-3xl ">
            {item.badge && (
              <Badge
                variant="secondary"
                className="rounded-full py-1 border-border"
                asChild
              >
                <span>{item.badge}</span>
              </Badge>
            )}
            <h1 className="mt-6 max-w-[17ch] text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-semibold leading-[1.2]! tracking-tighter">
              {item.title}
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg text-gray-600 dark:text-gray-300">
              {item.description}
            </p>
            {item.value && (
              <p className="text-2xl font-semibold text-primary mt-4">
                {formatCurrency(item.value)}
              </p>
            )}
          </div>

          {/* boutiques button */}
          <div className="mt-12 flex items-start justify-self-start gap-4 md:min-w-3xl">
            <Button size="standartButton" variant="standartButton" className="w-full">
              Get Started
            </Button>

          </div>
        </div>
      </div>
    </div>
  );


}
