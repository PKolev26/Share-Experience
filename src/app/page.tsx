"use client";

import { useState } from "react";
import Map, { Marker } from "react-map-gl";
import type { ViewState } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Home() {
const [viewState, setViewState] = useState<Partial<ViewState>>({
  longitude: 23.3219,
  latitude: 42.6977,
  zoom: 10,
  bearing: 0,
  pitch: 0,
});


  return (
    <div className="w-screen h-screen">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        style={{ width: "100%", height: "100%" }}
      >
        <Marker longitude={23.3219} latitude={42.6977}>
          <div style={{ color: "red", fontSize: "24px" }}>📍</div>
        </Marker>
      </Map>
    </div>
  );
}
