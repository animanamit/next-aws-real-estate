import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import type { NavigationItem } from "@/types"

const navigationItems: NavigationItem[] = [
  { label: "Properties", href: "/search" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Tenant Dashboard", href: "/tenants/dashboard" },
  { label: "Manager Dashboard", href: "/managers/dashboard" },
]

export default function NavigationHeader() {
  return (
    <header className="bg-pure-white border-b border-platinum-silver sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-muted-red rounded-lg">
              <Home className="h-4 w-4 text-pure-white" />
            </div>
            <span className="font-medium text-xl text-soft-black">RentEase</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-charcoal-grey hover:text-soft-black transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Sign In Button */}
          <Button
            variant="outline"
            className="border-muted-red text-muted-red hover:bg-muted-red hover:text-pure-white"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
