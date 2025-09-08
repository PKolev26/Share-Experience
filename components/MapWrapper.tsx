"use client";

import { useState } from "react";
import Map, { Marker, NavigationControl, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function MapWrapper() {
  const [viewState, setViewState] = useState({
    longitude: 23.3219,
    latitude: 42.6977,
    zoom: 14,
    pitch: 0,
    bearing: 0,
  });

  const [is3D, setIs3D] = useState(false);

  const toggle3D = () => {
    if (is3D) {
      setViewState((prev) => ({
        ...prev,
        pitch: 0,
        bearing: 0,
      }));
    } else {
      setViewState((prev) => ({
        ...prev,
        pitch: 60,
        bearing: -17,
      }));
    }
    setIs3D(!is3D);
  };

  return (
    <div className="w-screen h-screen relative">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/pkolev26/cmfbm4gua005g01qucmem0odc"
        style={{ width: "100%", height: "100%" }}
      >
        <Marker longitude={23.3219} latitude={42.6977}>
          <div className="text-red-500 text-2xl">📍</div>
        </Marker>

        <NavigationControl position="top-left" />

        <Source id="composite" type="vector" url="mapbox://mapbox.mapbox-streets-v8">
          <Layer
            id="3d-buildings"
            source="composite"
            source-layer="building"
            filter={["==", "extrude", "true"]}
            type="fill-extrusion"
            minzoom={15} 
            paint={{
              "fill-extrusion-color": "#aaa",
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "min_height"],
              "fill-extrusion-opacity": 0.6,
            }}
          />
        </Source>
      </Map>
=
      <button
        onClick={toggle3D}
        className="absolute bottom-24 right-4 bg-black text-white px-4 py-2 rounded-md shadow-md"
      >
        {is3D ? "2D" : "3D"}
      </button>
    </div>
  );
}
