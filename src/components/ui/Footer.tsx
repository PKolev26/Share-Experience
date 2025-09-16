"use client";

import { useRouter, usePathname } from "next/navigation";
import { Users, Newspaper, Home, MessageCircle, FileText } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { path: "/friends", label: "Friends", icon: Users },
    { path: "/feed", label: "Feed", icon: Newspaper },
    { path: "/", label: "Home", icon: Home },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/reviews", label: "Reviews", icon: FileText },
  ];

  return (
    <div
      className="fixed left-0 right-0 bg-black py-2 flex justify-around items-center shadow-lg"
      style={{
        bottom: "env(safe-area-inset-bottom)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)",
      }}
    >
      {navItems.map(({ path, label, icon: Icon }) => {
        const isActive = pathname === path;
        return (
          <button
            key={path}
            onClick={() => router.push(path)}
            className={`flex flex-col items-center flex-1 transition ${
              isActive ? "text-blue-400" : "text-white hover:text-blue-400"
            }`}
          >
            <Icon size={22} />
            <span className="text-xs">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
