"use client";

import { FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "../../Global/ui/button";
import TestimonialCard from "./mapCards";
import MapView from "./mapsContainer";
import MapsLoader from "./mapsLoader";
import React, { useState, useEffect, useRef } from "react";
import { FaStore } from "react-icons/fa";

export default function MapsHero() {
  const [loading, setLoading] = useState(true);
  const [showCards, setShowCards] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/response/api/store/all");
        const json = await res.json();
        if (json?.data) {
          const valid = json.data.filter((s: any) => {
            if (!s.latitude || !s.longitude) return false;
            const lat = parseFloat(s.latitude);
            const lng = parseFloat(s.longitude);
            return !isNaN(lat) && !isNaN(lng);
          });
          setStores(valid);
        }
      } catch {}
    }
    load();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleStoreClick = (store: any) => {
    if (showCards) {
      setShowCards(false);
    }
    if (mapRef.current && mapRef.current.focusOnStore) {
      mapRef.current.focusOnStore(store);
    }
  };

  return (
    <div className="w-full h-screen flex md:fixed relative">
      <div className="w-full lg:w-1/5 z-20 lg:flex flex-col hidden bg-background overflow-auto">
        <div className="gap-5 flex justify-center items-center bg-gray-100 dark:bg-zinc-900 text-xl py-4 px-2 shrink-0">
          <FaStore size={25} className="text-primary dark:text-white" />
          <h1 className="font-semibold text-black  dark:text-white">
           Boutiques
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto  pb-15 pt-5 scroll-smooth">
          <TestimonialCard data={stores} onStoreClick={handleStoreClick} />
        </div>
      </div>

      <div className="relative w-full lg:w-4/5 h-full flex items-center justify-center bg-transparent">
        {loading ? (
          <MapsLoader />
        ) : (
          <MapView stores={stores} ref={mapRef} />
        )}

        {showCards && (
          <div className="fixed inset-0 z-30 bg-white dark:bg-zinc-900 flex flex-col animate-fadeIn">
           

            <div className="flex-1 overflow-y-auto scroll-smooth">
              <TestimonialCard data={stores} onStoreClick={handleStoreClick} />
            </div>
          </div>
        )}

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
