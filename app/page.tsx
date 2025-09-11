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

const MapWrapper = dynamic(() => import("@/components/MapWrapper"), {
  ssr: false,
});

export default function HomePage() {
  const { graphicsOn, setGraphicsOn } = useSettings();
  const { theme, setTheme } = useSettings();
  const router = useRouter();
  return (
    <div className="w-screen h-screen">
      <MapWrapper />

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

      <div className="absolute bottom-0 left-0 right-0 bg-black py-2 flex justify-around items-center shadow-lg">
        <button
          onClick={() => router.push("/friends")}
          className="flex flex-col items-center flex-1 text-white hover:text-blue-400"
        >
          <Users size={22} />
          <span className="text-xs">Friends</span>
        </button>

        <button
          onClick={() => router.push("/feed")}
          className="flex flex-col items-center flex-1 text-white hover:text-blue-400"
        >
          <Newspaper size={22} />
          <span className="text-xs">Feed</span>
        </button>

        <button
          onClick={() => router.push("/")}
          className="flex flex-col items-center flex-1 text-blue-400"
        >
          <Home size={22} />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => router.push("/chat")}
          className="flex flex-col items-center flex-1 text-white hover:text-blue-400"
        >
          <MessageCircle size={22} />
          <span className="text-xs">Chat</span>
        </button>

        <button
          onClick={() => router.push("/reviews")}
          className="flex flex-col items-center flex-1 text-white hover:text-blue-400"
        >
          <FileText size={22} />
          <span className="text-xs">Reviews</span>
        </button>
      </div>
    </div>
  );
}
