"use client"

import type React from "react"
import { Heart, Bed, Bath, Square } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Property } from "@/lib/mock-data"

interface PropertyCardProps {
  property: Property
  viewType?: "grid" | "list"
}

export default function PropertyCard({ property, viewType = "grid" }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const isGrid = viewType === "grid"

  return (
    <Link href={`/search/${property.id}`}>
      <div
        className={`bg-white rounded-xl overflow-hidden ${
          isGrid ? "h-full" : "flex"
        }`}
      >
        {/* Image Section */}
        <div className={`relative ${isGrid ? "w-full h-48" : "w-1/3 h-full min-h-48"}`}>
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-2xl">🏠</span>
            </div>
          </div>
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
            />
          </button>
          {property.isFeatured && (
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={`p-6 ${isGrid ? "w-full" : "w-2/3"}`}>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{property.title}</h3>
            <p className="text-xl font-medium text-gray-900 whitespace-nowrap">
              ${property.price.toLocaleString()}
              <span className="text-sm text-gray-500 ml-1 font-normal">/mo</span>
            </p>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-1">
            {property.location.city}, {property.location.state}
            <span className="mx-2 text-gray-400">•</span>
            {property.propertyType}
          </p>

          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center space-x-1">
              <Bed className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Bath className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Square className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{property.squareFeet.toLocaleString()} sqft</span>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </div>
      </div>
    </Link>
  )
}