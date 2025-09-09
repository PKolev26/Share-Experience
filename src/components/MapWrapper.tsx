"use client";

import { useState, useCallback, useRef } from "react";
import throttle from "lodash.throttle";
import Map, { Marker, NavigationControl, MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { ViewStateChangeEvent } from "react-map-gl";
import { useSettings } from "@/contexts/SettingsContext";

export default function MapWrapper() {
  const mapRef = useRef<MapRef>(null);
  const { graphicsOn } = useSettings();

  const [viewState, setViewState] = useState({
    longitude: 23.3219,
    latitude: 42.6977,
    zoom: 14,
    pitch: 0,
    bearing: 0,
  });

  const [is3D, setIs3D] = useState(false);

  const handleMove = useCallback(
    throttle((evt: ViewStateChangeEvent) => {
      setViewState(evt.viewState);
    }, 50),
    []
  );

  const toggle3D = () => {
    if (!mapRef.current) return;

    if (is3D) {
      mapRef.current.flyTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        bearing: 0,
        pitch: 0,
        duration: 800,
      });
    } else {
      mapRef.current.flyTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom < 15 ? 15 : viewState.zoom,
        bearing: -17,
        pitch: 60,
        duration: 800,
      });
    }

    setIs3D(!is3D);
  };

  return (
    <div className="w-screen h-screen relative">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle={
          graphicsOn
            ? "mapbox://styles/pkolev26/cmfbm4gua005g01qucmem0odc"
            : "mapbox://styles/mapbox/streets-v12"
        }
        style={{ width: "100%", height: "100%" }}
      >
        <Marker longitude={23.3219} latitude={42.6977}>
          <div className="text-red-500 text-2xl">📍</div>
        </Marker>

        <NavigationControl
        position="top-left"
        style={{ marginTop: "70px", marginLeft: "10px" }}
        />

      </Map>

      <button
        onClick={toggle3D}
        className="absolute bottom-24 right-4 bg-black text-white px-4 py-2 rounded-md shadow-md"
      >
        {is3D ? "2D" : "3D"}
      </button>
    </div>
  );
}
