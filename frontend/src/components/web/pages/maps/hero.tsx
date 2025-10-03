"use client";

import { FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "../../Global/ui/button";
import TestimonialCard from "./mapCards";
import MapView from "./mapsContainer";
import MapsLoader from "./mapsLoader";
import React, { useState, useEffect } from "react";

export default function MapsHero() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-screen flex fixed">
      {/* Left sidebar - cards list */}
      <div className="w-1/5 z-20 lg:flex flex-col hidden bg-background">
        {/* Fixed title container */}
        <div className="flex justify-center items-center bg-gray-100 dark:bg-zinc-900 text-xl py-4 px-2 shrink-0">
          <FaMapMarkerAlt size={25} className="text-primary dark:text-white" />
          <h1 className="font-semibold text-black ml-4 dark:text-white">
            Resultados no Brasil
          </h1>
        </div>

        {/* Scrollable list container */}
        <div className="flex-1 overflow-y-auto">
          <TestimonialCard />
        </div>
      </div>

      {/* Map container */}
      <div className="w-full lg:w-4/5 h-full flex items-center justify-center bg-transparent">
        {loading ? (
          <MapsLoader />
        ) : (
          <MapView />
        )}
      </div>

      {/* Mobile button */}
      <Button
        variant="standartButton"
        size="mapButton"
        className="flex md:hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
      >
        List
      </Button>
    </div>
  );
}
