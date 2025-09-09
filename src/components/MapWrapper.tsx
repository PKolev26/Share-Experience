"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import throttle from "lodash.throttle";
import Map, {
  Popup,
  Marker,
  NavigationControl,
  AttributionControl,
  GeolocateControl,
  MapRef,
  MapLayerMouseEvent,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { ViewStateChangeEvent } from "react-map-gl";
import { useSettings } from "@/contexts/SettingsContext";
import ReviewDialog from "./ReviewDialog";

// 👇 Shadcn UI Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Poi = { name: string; longitude: number; latitude: number };

export default function MapWrapper() {
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const mapRef = useRef<MapRef>(null);
  const { graphicsOn } = useSettings();

  const [viewState, setViewState] = useState({
    longitude: 23.3219,
    latitude: 42.6977,
    zoom: 14,
    pitch: 0,
    bearing: 0,
  });

  const [userLocation, setUserLocation] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);

  const [is3D, setIs3D] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMove = useCallback(
    throttle((evt: ViewStateChangeEvent) => {
      setViewState(evt.viewState);
    }, 50),
    [setViewState]
  );

  const handleClick = (event: MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (feature && feature.properties) {
      setSelectedPoi({
        name: feature.properties.name || "Unknown",
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      });
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation({ latitude, longitude });

          setViewState((prev) => ({
            ...prev,
            latitude,
            longitude,
            zoom: 18,
          }));

          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 18,
            duration: 1000,
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
        }
      );
    }
  }, []);

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

  const backToLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 18,
        bearing: 0,
        pitch: is3D ? 60 : 0,
        duration: 800,
      });
    }
  };

  return (
    <div className="w-screen h-screen relative">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        onClick={handleClick}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        attributionControl={false}
        mapStyle={
          graphicsOn
            ? "mapbox://styles/pkolev26/cmfbm4gua005g01qucmem0odc"
            : "mapbox://styles/mapbox/streets-v12"
        }
        interactiveLayerIds={["poi-label"]}
        style={{ width: "100%", height: "100%" }}
      >
        <AttributionControl compact={true} position="top-left" />

        {userLocation && (
          <Marker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
          >
            <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md" />
          </Marker>
        )}

        {selectedPoi && (
          <Popup
            longitude={selectedPoi.longitude}
            latitude={selectedPoi.latitude}
            onClose={() => setSelectedPoi(null)}
          >
            <div className="p-2 text-sm">
              <h3 className="font-bold">{selectedPoi.name}</h3>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
              >
                Добави ревю
              </button>
            </div>
          </Popup>
        )}

        <NavigationControl position="top-left" style={{ marginTop: "30px" }} />
      </Map>

      <button
        onClick={toggle3D}
        className="absolute bottom-24 right-4 bg-black text-white px-4 py-2 rounded-md shadow-md"
      >
        {is3D ? "2D" : "3D"}
      </button>

      <button
        onClick={backToLocation}
        className="absolute bottom-24 left-4 w-12 h-12 flex items-center justify-center 
                   bg-white rounded-full shadow-md border border-gray-300 
                   hover:bg-gray-100 active:scale-95 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
          className="w-6 h-6"
        >
          <circle cx="12" cy="12" r="6" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
        </svg>
      </button>

      <ReviewDialog
  isOpen={isDialogOpen}
  onClose={() => setIsDialogOpen(false)}
  placeName={selectedPoi?.name || ""}
  onSave={(data) => {
    console.log("📌 Записано ревю:", data);
    // тук викаш API-то за запис в базата
  }}
/>

    </div>
  );
}
