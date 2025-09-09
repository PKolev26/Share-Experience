"use client";

import dynamic from "next/dynamic";
import { User, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSettings } from "@/contexts/SettingsContext";

const MapWrapper = dynamic(() => import("@/components/MapWrapper"), {
  ssr: false,
});

export default function HomePage() {
  const { graphicsOn, setGraphicsOn } = useSettings();

  return (
    <div className="w-screen h-screen">
      <MapWrapper />

      <button className="absolute top-4 right-4 bg-black text-white rounded-full p-3 shadow-lg">
        <User size={24} />
      </button>

      <Dialog>
        <DialogTrigger asChild>
          <button className="absolute top-4 left-4 bg-black text-white rounded-full p-3 shadow-lg">
            <Settings size={24} />
          </button>
        </DialogTrigger>

        <DialogContent className="bg-white rounded-xl p-6 w-[350px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Settings
            </DialogTitle>
            <DialogDescription>
              Manage your map preferences
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2">
            <label className="flex items-center justify-between">
              <span className="font-medium">Enhanced Graphics</span>
              <input
                type="checkbox"
                className="w-5 h-5 accent-black"
                checked={graphicsOn}
                onChange={(e) => setGraphicsOn(e.target.checked)}
              />
            </label>
            <p className="text-sm text-gray-500">
              Enables 3D buildings and advanced map rendering. May affect
              performance on low-end devices.
            </p>
          </div>
        </DialogContent>
      </Dialog>

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
