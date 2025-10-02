"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { Button } from "../../Global/ui/button";
import TestimonialCard from "./mapCards";

const MapContainer = dynamic(
  () => import("react-leaflet").then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then(mod => mod.Popup),
  { ssr: false }
);

export default function MapsHero() {
  const position: [number, number] = [-23.5686379, -46.4789122];
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then(L => {
      setCustomIcon(
        L.divIcon({
          className: "custom-div-icon",
          html: ReactDOMServer.renderToString(
            <FaMapMarkerAlt size={32} color="#ff0000" />
          ),
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        })
      );
    });
  }, []);

  return (
    <div className="w-full h-screen flex relative">
      <div className=" w-1/5 z-20 bg-background lg:flex flex-col hidden">
        <div>
          <h1 className="text-4xl font-semibold text-primary p-6 border-b border-border/50">
            Mapa
          </h1>
        </div>
        <div>
          <TestimonialCard />
        </div>
      </div>

      <div className="w-full lg:w-4/5 h-full z-10 relative">
        <MapContainer center={position} zoom={4.5} scrollWheelZoom className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {customIcon && (
            <Marker position={position} icon={customIcon}>
              <Popup>
                <h1 className="font-semibold uppercase text-sm">Casa do soalheiro</h1>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <Button
        variant="standartButton"
        size="mapButton"
        className="flex md:hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
      >
        Lista
      </Button>
    </div>
  );
}
