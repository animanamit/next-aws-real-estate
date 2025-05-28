"use client"

import type React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { mockUsers } from "@/lib/mock-users"

interface DashboardLayoutProps {
  children: React.ReactNode
  role: "tenant" | "manager"
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  // Use a mock user based on role
  const user = mockUsers.find((u) => u.role === role) || mockUsers[0]

  return (
    <div className="min-h-screen bg-platinum-light">
      <SidebarProvider>
        <DashboardSidebar user={user} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </div>
  )
}
