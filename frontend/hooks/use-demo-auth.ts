"use client";

import { useDemoMode } from "@/lib/demo-mode-context";
import { useGetAuthUserQuery } from "@/state/api";

export function useDemoAuth() {
  const { isDemoMode, currentRole, demoUserId } = useDemoMode();
  
  const authQuery = useGetAuthUserQuery({
    demoMode: isDemoMode,
    demoRole: currentRole,
    demoUserId: demoUserId,
  });

  return {
    ...authQuery,
    isDemoMode,
    currentRole,
  };
}