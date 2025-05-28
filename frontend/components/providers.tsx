"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { Toaster } from "sonner"
import { DemoModeProvider, useDemoMode } from "@/lib/demo-mode-context"
import { DemoModeToggle } from "@/components/demo-mode-toggle"

function DemoModeToggleWrapper() {
  const { isDemoMode, currentRole, setDemoMode, switchRole } = useDemoMode();
  
  return (
    <DemoModeToggle
      currentRole={currentRole}
      onRoleChange={switchRole}
      isDemoMode={isDemoMode}
      onDemoModeChange={setDemoMode}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <DemoModeProvider>
        {children}
        <DemoModeToggleWrapper />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--pure-white)',
              border: '1px solid var(--platinum-silver)',
              color: 'var(--soft-black)',
              fontFamily: 'var(--font-neue)',
            },
            className: 'font-neue',
          }}
          closeButton
        />
      </DemoModeProvider>
    </Provider>
  )
}
