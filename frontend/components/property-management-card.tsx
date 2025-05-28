import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/lib/mock-data"
import { Edit, Eye } from "lucide-react"
import Link from "next/link"

interface PropertyManagementCardProps {
  property: Property
}

export default function PropertyManagementCard({ property }: PropertyManagementCardProps) {
  return (
    <Card className="border-2 border-platinum-silver overflow-hidden hover:border-muted-red transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-40 md:h-auto relative">
          <img
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {property.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-golden-accent text-soft-black font-bold">Featured</Badge>
          )}
        </div>
        <div className="flex-1 p-4 bg-linear-to-b from-platinum-silver/10 to-pure-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
            <h3 className="font-neue font-semibold text-lg text-muted-red">{property.title}</h3>
            <div className="flex items-center mt-1 md:mt-0">
              <p className="font-space font-bold text-xl text-muted-red">
                ${property.price.toLocaleString()}
                <span className="text-sm text-warm-grey">/mo</span>
              </p>
            </div>
          </div>

          <div className="mb-4 p-3 bg-light-yellow/10 rounded-lg border-l-4 border-golden-accent">
            <p className="text-charcoal-grey">
              {property.location.city}, {property.location.state}
              <span className="mx-2 text-muted-red">•</span>
              {property.propertyType}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-4 p-3 bg-muted-red/10 rounded-lg border-l-4 border-coral-accent">
            <div className="flex items-center">
              <span className="font-space font-medium text-muted-red">{property.bedrooms}</span>
              <span className="text-warm-grey ml-1 text-sm">Beds</span>
            </div>
            <div className="flex items-center">
              <span className="font-space font-medium text-muted-red">{property.bathrooms}</span>
              <span className="text-warm-grey ml-1 text-sm">Baths</span>
            </div>
            <div className="flex items-center">
              <span className="font-space font-medium text-muted-red">{property.squareFeet.toLocaleString()}</span>
              <span className="text-warm-grey ml-1 text-sm">Sq Ft</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="default" size="sm" className="bg-muted-red hover:bg-coral-accent text-white" asChild>
              <Link href={`/managers/edit-property/${property.id}`}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-golden-accent hover:bg-light-yellow text-soft-black"
              asChild
            >
              <Link href={`/search/${property.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
