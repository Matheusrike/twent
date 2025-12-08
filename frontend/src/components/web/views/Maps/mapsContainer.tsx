"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
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

interface MapViewProps {
  stores: any[];
}

const MapView = forwardRef(({ stores }: MapViewProps, ref) => {
  const [customIcon, setCustomIcon] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  useImperativeHandle(ref, () => ({
    focusOnStore: (store: any) => {
      const lat = parseFloat(store.latitude);
      const lng = parseFloat(store.longitude);

      if (mapRef.current && !isNaN(lat) && !isNaN(lng)) {
        const map = mapRef.current;
        
        // Animar movimento do mapa até a loja
        map.flyTo([lat, lng], 15, {
          duration: 1.5,
          easeLinearity: 0.25
        });

        // Abrir popup do marcador correspondente
        setTimeout(() => {
          const marker = markersRef.current[store.id];
          if (marker) {
            marker.openPopup();
          }
        }, 1600); // Espera a animação do flyTo terminar
      }
    },
  }));

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
      ref={mapRef}
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
            ref={(markerRef) => {
              if (markerRef) {
                markersRef.current[store.id] = markerRef;
              }
            }}
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
});

MapView.displayName = 'MapView';

export default MapView;