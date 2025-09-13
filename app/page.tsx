"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { User, Settings, Home, FileText, Users, Newspaper, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSettings } from "@/contexts/SettingsContext";
import { useState } from "react";
import { useEffect } from "react";
import Footer from "@/components/ui/Footer";

const MapWrapper = dynamic(() => import("@/components/MapWrapper"), {
  ssr: false,
});

export default function HomePage() {
  const { graphicsOn, setGraphicsOn } = useSettings();
  const { theme, setTheme } = useSettings();
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const [forceNoLocation, setForceNoLocation] = useState(false);
  const router = useRouter();

  useEffect(() => {
  const handler = () => setShowFallback(true);
  window.addEventListener("geolocation-denied", handler);
  return () => window.removeEventListener("geolocation-denied", handler);
}, []);
  
  return (
    <div className="w-screen h-screen relative">
      {loading && (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-50 px-6">
    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
    <p className="text-lg font-medium mb-2">Waiting for location...</p>

    {showFallback && (
      <p className="text-xs text-gray-400 text-center">
        If location access is denied, some features may be limited. <br />
        <button
          onClick={() => {
            setLoading(false);
            setForceNoLocation(true);
          }}
          className="underline text-gray-500 hover:text-gray-300 mt-1"
        >
          Continue without location
        </button>
      </p>
    )}
  </div>
)}



      <MapWrapper onLoaded={() => setLoading(false)} />

       <button
      onClick={() => router.push("/login")}
      className="absolute top-4 right-4 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition"
    >
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
          <div className="mt-4 space-y-2">
  <span className="font-medium">Map Theme</span>
  <div className="flex items-center gap-4 mt-2">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="theme"
        value="light"
        checked={theme === "light"}
        onChange={() => setTheme("light")}
        className="accent-black"
      />
      Light
    </label>

    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="theme"
        value="dark"
        checked={theme === "dark"}
        onChange={() => setTheme("dark")}
        className="accent-black"
      />
      Dark
    </label>

    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name="theme"
        value="auto"
        checked={theme === "auto"}
        onChange={() => setTheme("auto")}
        className="accent-black"
      />
      Auto
    </label>
  </div>
  <p className="text-sm text-gray-500">
    Choose map theme manually or use <b>Auto</b> to switch by sunrise/sunset.
  </p>
</div>
        </DialogContent>
      </Dialog>

      <Footer>
      </Footer>
    </div>
  );
}
