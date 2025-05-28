"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DemoModeContextType {
  isDemoMode: boolean;
  currentRole: "tenant" | "manager";
  demoUserId: string;
  setDemoMode: (enabled: boolean) => void;
  switchRole: (role: "tenant" | "manager") => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

// Demo user data from your seeded database
const DEMO_USERS = {
  tenant: {
    cognitoId: "817b3540-a061-707b-742a-a28391181149", // Carol White
    name: "Carol White",
    email: "carol.white@example.com",
  },
  manager: {
    cognitoId: "010be580-60a1-70ae-780e-18a6fd94ad32", // John Smith
    name: "John Smith", 
    email: "john.smith@example.com",
  },
};

export function DemoModeProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [currentRole, setCurrentRole] = useState<"tenant" | "manager">("tenant");

  // Load demo mode state from localStorage on mount
  useEffect(() => {
    const savedDemoMode = localStorage.getItem("demo-mode-enabled");
    const savedRole = localStorage.getItem("demo-current-role") as "tenant" | "manager";
    
    if (savedDemoMode === "true") {
      setIsDemoMode(true);
    }
    if (savedRole) {
      setCurrentRole(savedRole);
    }
  }, []);

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    localStorage.setItem("demo-mode-enabled", enabled.toString());
    
    if (!enabled) {
      // Clear demo state when disabled
      localStorage.removeItem("demo-current-role");
      setCurrentRole("tenant");
    }
  };

  const switchRole = (role: "tenant" | "manager") => {
    setCurrentRole(role);
    localStorage.setItem("demo-current-role", role);
    
    // Trigger a page refresh to reload with new role
    window.location.reload();
  };

  const demoUserId = DEMO_USERS[currentRole].cognitoId;

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        currentRole,
        demoUserId,
        setDemoMode,
        switchRole,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error("useDemoMode must be used within a DemoModeProvider");
  }
  return context;
}

export { DEMO_USERS };