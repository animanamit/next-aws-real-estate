"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { type RootState, removeFavorite } from "@/lib/store"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { mockFavorites } from "@/lib/mock-users"
import { properties } from "@/lib/mock-data"
import type { Property, MockFavorites } from "@/types"
import { Heart, Search } from "lucide-react"
import Link from "next/link"
import PropertyCard from "@/components/property-card"

export default function TenantFavorites() {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const [favorites, setFavorites] = useState<Property[]>([])

  useEffect(() => {
    if (currentUser) {
      // Get tenant's favorites
      const userFavorites = (mockFavorites as MockFavorites)[currentUser] || []
      const favoriteProperties = properties.filter((prop) => userFavorites.includes(prop.id))
      setFavorites(favoriteProperties)
    }
  }, [currentUser])

  const handleRemoveFavorite = (propertyId: string) => {
    dispatch(removeFavorite(propertyId))
    setFavorites(favorites.filter((property) => property.id !== propertyId))
  }

  return (
    <DashboardLayout role="tenant">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-neue font-bold text-2xl text-soft-black">Favorite Properties</h1>
          <Button asChild>
            <Link href="/search">
              <Search className="h-4 w-4 mr-2" />
              Browse More Properties
            </Link>
          </Button>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <div key={property.id} className="relative">
                <button
                  onClick={() => handleRemoveFavorite(property.id)}
                  className="absolute top-3 right-3 z-10 p-2 bg-pure-white/80 rounded-full hover:bg-pure-white transition-colors"
                  aria-label="Remove from favorites"
                >
                  <Heart className="h-5 w-5 fill-muted-red text-muted-red" />
                </button>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-platinum-silver/10 rounded-lg">
            <Heart className="h-12 w-12 text-warm-grey mx-auto mb-4" />
            <h2 className="font-neue font-semibold text-xl text-soft-black mb-2">No Favorites Yet</h2>
            <p className="text-warm-grey mb-6 max-w-md mx-auto">
              You haven't saved any properties to your favorites yet. Browse properties and click the heart icon to save
              them here.
            </p>
            <Button asChild>
              <Link href="/search">
                <Search className="h-4 w-4 mr-2" />
                Browse Properties
              </Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
