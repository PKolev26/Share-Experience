"use client";

import { createContext, useContext, useState } from "react";

type SettingsContextType = {
  graphicsOn: boolean;
  setGraphicsOn: (value: boolean) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [graphicsOn, setGraphicsOn] = useState(false);

  return (
    <SettingsContext.Provider value={{ graphicsOn, setGraphicsOn }}>
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
