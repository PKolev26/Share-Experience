"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import type { MapRef } from "react-map-gl";

type Props = {
  mapRef: React.RefObject<MapRef | null>;
  selectedPoi: { name: string; longitude: number; latitude: number } | null;
  setSelectedPoi: (poi: null) => void;
  setIsDialogOpen: (v: boolean) => void;
};

export default function CustomPopup({
  mapRef,
  selectedPoi,
  setSelectedPoi,
  setIsDialogOpen,
}: Props) {
  const { theme } = useSettings();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    if (!mapRef?.current || !selectedPoi) return;
    const map = mapRef.current.getMap();

    const updatePosition = () => {
      const point = map.project([selectedPoi.longitude, selectedPoi.latitude]);
      setPosition({ x: point.x, y: point.y - 20 });
    };

    updatePosition();
    map.on("move", updatePosition);
    map.on("zoom", updatePosition);

    return () => {
      map.off("move", updatePosition);
      map.off("zoom", updatePosition);
    };
  }, [selectedPoi, mapRef]);

  if (!selectedPoi || !position) return null;

  return (
    <div
      className="absolute z-50 transform -translate-x-1/2 -translate-y-full"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div
        className={`relative w-64 p-4 rounded-lg shadow-md border ${
          theme === "dark" || theme === "auto"
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white text-black border-gray-300"
        }`}
      >
        <button
          onClick={() => setSelectedPoi(null)}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
        >
          <X size={16} />
        </button>

        <h3 className="text-center font-semibold mb-3">{selectedPoi.name}</h3>

        <button
          onClick={() => setIsDialogOpen(true)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
        >
          Добави ревю
        </button>

        <div
          className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 ${
            theme === "dark" || theme === "auto"
              ? "bg-gray-800 border-b border-r border-gray-700"
              : "bg-white border-b border-r border-gray-300"
          }`}
          style={{ bottom: "-8px" }}
        ></div>
      </div>
    </div>
  );
}
