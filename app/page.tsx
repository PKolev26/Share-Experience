"use client";

import dynamic from "next/dynamic";
import { User } from "lucide-react";

const MapWrapper = dynamic(() => import("../components/MapWrapper"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div className="w-screen h-screen">
      <MapWrapper />

      <button className="absolute top-4 right-4 bg-black text-white rounded-full p-3 shadow-lg">
        <User size={24} />
      </button>

      <div className="absolute bottom-0 left-0 right-0 bg-black py-4 flex justify-around items-center shadow-lg">
        <button className="bg-white text-black font-semibold px-6 py-2 rounded-md shadow-md">
          Friends
        </button>
        <button className="bg-white text-black font-semibold px-6 py-2 rounded-md shadow-md">
          Home
        </button>
        <button className="bg-white text-black font-semibold px-6 py-2 rounded-md shadow-md">
          Records
        </button>
      </div>
    </div>
  );
}
