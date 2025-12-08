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

export default function MapView({stores}: {stores: any[]}) {
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

  const initialCenter =
    stores.length > 0
      ? [parseFloat(stores[0].latitude), parseFloat(stores[0].longitude)]
      : [-23.5686, -46.4789];

  return (
    <MapContainer
      center={initialCenter as any}
      zoom={4.5}
      scrollWheelZoom
      minZoom={3}
      maxZoom={18}
      className="w-full h-full z-10 lg:z-0"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {customIcon &&
        stores.map(store => (
          <Marker
            key={store.id}
            icon={customIcon}
            position={[
              parseFloat(store.latitude),
              parseFloat(store.longitude),
            ]}
          >
            <Popup>
              <h1 className="font-semibold uppercase text-sm">{store.name}</h1>
              <p className="text-xs">{store.city} — {store.country}</p>
              {store.phone && (
                <p className="text-xs mt-1">📞 {store.phone}</p>
              )}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
