"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "./Toaster";

interface SystemState {
  status: "operational" | "degraded";
  toggleChaos: () => void;
}

const SystemContext = createContext<SystemState | undefined>(undefined);

export const SystemProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<"operational" | "degraded">(
    "operational",
  );

  const toggleChaos = () => {
    if (status === "operational") {
      setStatus("degraded");
      toast.error("SYSTEM ALERT: Critical DB Latency Spike!");
    } else {
      setStatus("operational");
      toast.success("Systems normalized.");
    }
  };

  return (
    <SystemContext.Provider value={{ status, toggleChaos }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error("useSystem must be used within SystemProvider");
  return context;
};
