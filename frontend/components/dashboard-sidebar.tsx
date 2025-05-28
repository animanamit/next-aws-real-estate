"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Home, Heart, FileText, Settings, LogOut, Building, Plus, Users, User, BarChart3 } from "lucide-react"
import Link from "next/link"
import type { User as UserType } from "@/lib/mock-users"

interface DashboardSidebarProps {
  user: UserType
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  const basePath = user.role === "tenant" ? "/tenants" : "/managers"

  const tenantNavItems = [
    { label: "Dashboard", href: `${basePath}/dashboard`, icon: BarChart3 },
    { label: "Favorites", href: `${basePath}/favorites`, icon: Heart },
    { label: "Residences", href: `${basePath}/residences`, icon: Building },
    { label: "Applications", href: `${basePath}/applications`, icon: FileText },
    { label: "Settings", href: `${basePath}/settings`, icon: Settings },
  ]

  const managerNavItems = [
    { label: "Dashboard", href: `${basePath}/dashboard`, icon: BarChart3 },
    { label: "Properties", href: `${basePath}/properties`, icon: Building },
    { label: "Applications", href: `${basePath}/applications`, icon: Users },
    { label: "Add Property", href: `${basePath}/add-property`, icon: Plus },
    { label: "Settings", href: `${basePath}/settings`, icon: Settings },
  ]

  const navItems = user.role === "tenant" ? tenantNavItems : managerNavItems

  return (
    <div className="w-64 h-screen bg-pure-white flex flex-col">
      {/* Back to Home - Top */}
      <div className="p-6">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-charcoal-grey hover:text-soft-black transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>
      </div>

      {/* Brand */}
      <div className="px-6 pb-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-soft-black flex items-center justify-center">
            <Home className="h-4 w-4 text-pure-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-soft-black">RentEase</h1>
            <p className="text-sm text-warm-grey font-normal">
              {user.role === "tenant" ? "Find homes" : "Manage properties"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href.includes('dashboard') && pathname.includes('dashboard'))
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-muted-red text-pure-white"
                    : "text-charcoal-grey hover:bg-platinum-light hover:text-soft-black"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* User Info - Bottom */}
      <div className="p-6">
        <div className="flex items-center space-x-3 p-4 bg-platinum-light">
          <div className="w-8 h-8 overflow-hidden bg-warm-grey flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="h-4 w-4 text-pure-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-soft-black truncate">{user.name}</div>
            <div className="text-xs text-warm-grey truncate capitalize">{user.role}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
