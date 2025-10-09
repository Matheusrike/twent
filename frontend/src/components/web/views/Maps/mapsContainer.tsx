"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { FaStore } from "react-icons/fa";
import "leaflet/dist/leaflet.css";

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

export default function MapView() {
  const position: [number, number] = [-23.5686379, -46.4789122];
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then(L => {
      setCustomIcon(
        L.divIcon({
          className: "custom-div-icon",
          html: ReactDOMServer.renderToString(
            <FaStore size={32} className="text-primary" />
          ),
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        })
      );
    });
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={4.5}
      scrollWheelZoom
      minZoom={3}
      maxZoom={18}
      className="w-full h-full z-10 lg:z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {customIcon && (
        <Marker position={position} icon={customIcon}>
          <Popup>
            <h1 className="font-semibold uppercase text-sm">
              Casa do soalheiro
            </h1>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
