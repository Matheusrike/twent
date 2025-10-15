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
import CollectionIdSideBar from "@/components/web/pages/Collection/id/sideBar/navigation-sheet";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/web/Global/Navbar/sheet";

export default function CollectionIdHero({ params }: any) {
  const router = useRouter();
  const { id } = params;
  const item = cardsDataTest.items.find((item) => item.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full min-h-screen">

        {/* image desktop */}
        <div className="hidden lg:flex lg:w-3/5 xl:w-4/5 h-screen sticky top-0 p-4 flex-col gap-4">

          {/* image main */}
          <div className="relative w-full h-2/3 rounded-2xl overflow-hidden">
            <Image
              src="/images/collection/gradient.png"
              alt="gradient"
              fill
              className="object-cover object-center bg-gray-300"
              priority
            />
          </div>

          {/* image container */}
          <div className="flex gap-4 w-full h-1/3">
            <div className="relative w-1/2 h-full rounded-2xl overflow-hidden">
              <Image
                src="/images/collection/gradient.png"
                alt="gradient"
                fill
                className="object-cover object-center bg-gray-300"
                priority
              />
            </div>
            <div className="relative w-1/2 h-full rounded-2xl overflow-hidden">
              <Image
                src="/images/collection/gradient.png"
                alt="gradient"
                fill
                className="object-cover object-center bg-gray-300"
                priority
              />
            </div>
          </div>
        </div>

        {/* image mobile */}
        <div className="lg:hidden w-full px-4 pt-4 pb-2 flex flex-col gap-4">
          {/* Image 1 */}
          <div className="relative w-full h-[300px] sm:h-[400px]">
            <Image
              src="/images/collection/gradient.png"
              alt="gradient"
              fill
              className="object-cover object-center bg-gray-300 rounded-2xl"
              priority
            />
          </div>

        </div>

        {/* data content */}
        <div className="w-full lg:w-2/5 xl:w-1/2 flex flex-col px-6 py-8 lg:px-12 lg:py-15 lg:overflow-y-auto">

          {/* return to previous */}
          <div className="hidden lg:flex w-full mb-6 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="cursor-pointer flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4 text-[#DE1A26]" />
              Voltar à página anterior
            </Button>
          </div>

          {/* info content */}
          <div className="flex flex-col items-start w-full">
            {item.badge && (
              <Badge
                variant="secondary"
                className="rounded-full py-1 border-border dark:border-white/40 text-sm bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200"
                asChild
              >
                <span>{item.badge}</span>
              </Badge>
            )}
            <h1 className="mt-6 max-w-[17ch] text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-semibold leading-tight tracking-tighter dark:text-white">
              {item.title}
            </h1>
            {item.value && (
              <p className="text-2xl sm:text-3xl font-bold text-primary mt-4">
                {formatCurrency(item.value)}
              </p>
            )}

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-200">
              {item.description}
            </p>

            {/* Technical specifications */}
            <div className="mt-8 w-full space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold dark:text-white">Especificações</h2>
              <div className="space-y-3 text-sm">
                {item.reference && (
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-gray-600 dark:text-gray-200">Referência</span>
                    <span className="font-medium">{item.reference}</span>
                  </div>
                )}
                {item.material && (
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-gray-600 dark:text-gray-200">Material</span>
                    <span className="font-medium">{item.material}</span>
                  </div>
                )}
                {item.movement && (
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-gray-600 dark:text-gray-200">Movimento</span>
                    <span className="font-medium">{item.movement}</span>
                  </div>
                )}
                {item.diameter && (
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-gray-600 dark:text-gray-200">Diâmetro</span>
                    <span className="font-medium">{item.diameter}</span>
                  </div>
                )}
                {item.waterResistance && (
                  <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                    <span className="text-gray-600 dark:text-gray-200">Resistência à água</span>
                    <span className="font-medium">{item.waterResistance}</span>
                  </div>
                )}
              </div>
            </div>
          </div>


          <CollectionIdSideBar />
        </div>


      </div>

    </div >
  );
}