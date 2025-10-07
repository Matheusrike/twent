"use client";

import { FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "../../Global/ui/button";
import TestimonialCard from "./mapCards";
import MapView from "./mapsContainer";
import MapsLoader from "./mapsLoader";
import React, { useState, useEffect } from "react";

export default function MapsHero() {
  const [loading, setLoading] = useState(true);
  const [showCards, setShowCards] = useState(false); // controls visibility on mobile

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen flex md:fixed relative">
      {/* Fixed sidebar (desktop) */}
      <div className="w-full lg:w-1/5  z-20 lg:flex flex-col hidden bg-background overflow-auto">
        <div className="flex justify-center items-center bg-gray-100 dark:bg-zinc-900 text-xl py-4 px-2 shrink-0">
          <FaMapMarkerAlt size={25} className="text-primary dark:text-white" />
          <h1 className="font-semibold text-black ml-4 dark:text-white">
            Resultados em Brasil
          </h1>
        </div>
        <div className="flex-1">
          <TestimonialCard />
        </div>
      </div>

      {/* Map container */}
      <div className="relative w-full lg:w-4/5 h-full flex items-center justify-center bg-transparent">
        {loading ? <MapsLoader /> : <MapView />}

        {/* Fullscreen overlay on mobile */}
        {showCards && (
          <div className="fixed inset-0 z-30 bg-white dark:bg-zinc-900 flex flex-col animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center bg-gray-100 dark:bg-zinc-800 text-lg py-4 px-4 shadow-md">
              <div className="flex items-center">
                <FaMapMarkerAlt
                  size={22}
                  className="text-primary dark:text-white mr-2"
                />
                <h2 className="font-semibold text-black dark:text-white">
                  Resultados em Brasil
                </h2>
              </div>
            </div>

            {/* Card list (fills the entire screen) */}
            <div className="flex-1 overflow-y-auto p-3">
              <TestimonialCard />
            </div>
          </div>
        )}

        {/* Mobile toggle button */}
        <Button
          variant="standartButton"
          size="mapButton"
          onClick={() => setShowCards((prev) => !prev)}
          className="md:hidden fixed bottom-15 left-1/2 -translate-x-1/2 z-40"
        >
          {showCards ? "Fechar" : "Lista"}
        </Button>
      </div>
    </div>
  );
}
