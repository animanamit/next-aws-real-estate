import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDgwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iODAwIiBmaWxsPSIjRThFOEU4Ii8+CjxyZWN0IHg9IjUwMCIgeT0iMzUwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgcng9IjgiIGZpbGw9IiNBOEE4QTgiLz4KPC9zdmc+"
          alt="Modern apartment building"
          className="w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 leading-[1.1] tracking-tight">
            Find Your Perfect
            <span className="block mt-1">Rental Home</span>
          </h1>

          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Discover verified properties, apply instantly, and move in with confidence. Your next home is just a search
            away.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-4 max-w-2xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  placeholder="Enter city, neighborhood, or address"
                  className="pl-12"
                />
              </div>
              <Button size="lg" asChild>
                <Link href="/search">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-sm text-white/60">
            Over 10,000+ verified properties available nationwide
          </p>
        </div>
      </div>
    </section>
  )
}
