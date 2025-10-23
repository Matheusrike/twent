"use client";

import { Button } from "@/components/web/Global/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import StoreCard from "../card/storeCard";
import ContactForm from "../contactForm/form";
import { useState } from "react";

export default function CollectionIdSideBar() {
  const [showForm, setShowForm] = useState(false);

  const handleCardClick = () => {
    setShowForm(true);
  };

  const handleBackClick = () => {
    setShowForm(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShowForm(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Sheet onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button size="standartButton" variant="standartButton" className="w-full! h-auto">
            Contactar Uma Boutique
          </Button>
        </SheetTrigger>
       
        <SheetContent side="right" className="p-6 flex flex-col gap-4" showForm={showForm}>
          {!showForm ? (
            <StoreCard onClick={handleCardClick} />
          ) : (
            <ContactForm onBack={handleBackClick} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}