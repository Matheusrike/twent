import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ArrowRight, Shapes } from "lucide-react";
import React from "react";
import Image from "next/image";

const StoreCard = () => {
  return (
    <Card className="flex justify-center items-center w-full h-50 gap-0 pt-0 group bg-white dark:bg-background border border-gray-200/50 dark:border-white/5 hover:border-primary dark:hover:border-primary transition-all duration-500 overflow-hidden rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 hover:z-40 ">
      <CardHeader className="py-4 px-5 flex flex-row items-center gap-3 font-semibold">

      </CardHeader>

      <CardContent className="text-muted-foreground flex items-center gap-10">

        <div className="relative w-40 h-40 rounded-xl bg-muted overflow-hidden">
          <Image
            src="/profile.png"
            fill
            alt="Picture of the author"
            className="object-cover object-center"
          />
        </div>

        <div className="flex flex-col gap-2 w-1/2">
          <h3 className="text-lg font-semibold">Boutique Exemplo</h3>
          <p className="text-sm text-muted-foreground">
            Esta é uma breve descrição da boutique. Encontre produtos exclusivos e de alta qualidade aqui.
          </p>
        </div>

      </CardContent>


    </Card>
  );
};

export default StoreCard;
