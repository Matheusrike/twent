"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { Button } from "../../Global/ui/button";

const MapsHero = () => {
  const position: [number, number] = [-23.5686379, -46.4789122];

  const customIcon = L.divIcon({
    className: "custom-div-icon",
    html: ReactDOMServer.renderToString(
      <FaMapMarkerAlt size={32} color="#ff0000" />
    ),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <div className="w-full h-screen flex relative">
      {/* side bar */}
      <div className=" w-1/5 z-20 bg-background lg:flex flex-col hidden">
        <div>

        </div>

        <div>

        </div>

      </div>
      {/* map container */}
      <div className="w-full lg:w-4/5 h-full z-10 relative">
        <MapContainer
          center={position}
          zoom={4.5}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={customIcon}>
            <Popup>
              <h1 className="font-semibold uppercase text-sm">Casa do soalheiro</h1>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/*  mobile button */}
      <Button
        variant="standartButton"
        size="mapButton"
        className="flex md:hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
      >
        Lista
      </Button>


    </div>
  );
};

export default MapsHero;
