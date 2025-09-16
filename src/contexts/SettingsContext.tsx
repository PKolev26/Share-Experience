"use client";

import { createContext, useContext, useState } from "react";

type SettingsContextType = {
  graphicsOn: boolean;
  setGraphicsOn: (value: boolean) => void;
  theme: "light" | "dark" | "auto";
  setTheme: (t: "light" | "dark" | "auto") => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [graphicsOn, setGraphicsOn] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");

  return (
    <SettingsContext.Provider value={{ graphicsOn, setGraphicsOn, theme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
