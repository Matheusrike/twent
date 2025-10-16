"use client"; // necessário para habilitar componentes client-side

import { Button } from "@/components/web/Global/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./sheet";
import StoreCard from "../card/storeCard";
import { InputEmail } from "../forms/input-email";
import { InputName } from "../forms/input-name";
import { InputCountry } from "../forms/input-regiao";
import { InputLanguage } from "../forms/input-language";
import { InputPhone } from "../forms/input-phone";
import { Textarea } from "../forms/textarea";

export default function CollectionIdSideBar() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="standartButton" variant="standartButton" className="w-full max-w-xs h-auto">
            Contactar Uma Boutique
          </Button>
        </SheetTrigger>
       
        <SheetContent side="right" className="p-6 flex flex-col gap-4 ">
     
     
          <StoreCard />
        </SheetContent>
        <InputEmail />
        <InputName />
        <InputCountry />
        <InputLanguage />
        <InputPhone />
        <Textarea />
      </Sheet>
    </div>
  );
}
