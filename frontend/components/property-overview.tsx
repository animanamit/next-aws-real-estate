import { Calendar, Home, MapPin, Maximize } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Property } from "@/lib/mock-data"

interface PropertyOverviewProps {
  property: Property
}

export default function PropertyOverview({ property }: PropertyOverviewProps) {
  return (
    <Card className="border-platinum-silver">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="font-neue font-bold text-2xl md:text-3xl text-soft-black mb-2">{property.title}</h1>
            <div className="flex items-center text-charcoal-grey">
              <MapPin className="h-4 w-4 mr-1" />
              <p>
                {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="font-space font-bold text-3xl text-muted-red">
              ${property.price.toLocaleString()}
              <span className="text-base text-warm-grey">/mo</span>
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col items-center p-3 bg-platinum-silver/20 rounded-lg">
            <Home className="h-5 w-5 text-muted-red mb-1" />
            <span className="text-warm-grey text-sm">Type</span>
            <span className="font-space font-medium text-soft-black">{property.propertyType}</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-platinum-silver/20 rounded-lg">
            <span className="font-space font-medium text-xl text-muted-red mb-1">{property.bedrooms}</span>
            <span className="text-warm-grey text-sm">Bedrooms</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-platinum-silver/20 rounded-lg">
            <span className="font-space font-medium text-xl text-muted-red mb-1">{property.bathrooms}</span>
            <span className="text-warm-grey text-sm">Bathrooms</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-platinum-silver/20 rounded-lg">
            <Maximize className="h-5 w-5 text-muted-red mb-1" />
            <span className="text-warm-grey text-sm">Area</span>
            <span className="font-space font-medium text-soft-black">{property.squareFeet.toLocaleString()} sq ft</span>
          </div>
        </div>

        <div className="flex items-center mb-6">
          <Calendar className="h-5 w-5 text-muted-red mr-2" />
          <span className="text-charcoal-grey">
            Available from{" "}
            <span className="font-space font-medium text-soft-black">
              {new Date(property.availableFrom).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </span>
        </div>

        <div>
          <h3 className="font-neue font-semibold text-lg text-soft-black mb-2">Key Highlights</h3>
          <div className="flex flex-wrap gap-2">
            {property.amenities.slice(0, 5).map((amenity) => (
              <span key={amenity} className="px-3 py-1 bg-platinum-silver/30 text-charcoal-grey rounded-full text-sm">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 5 && (
              <span className="px-3 py-1 bg-platinum-silver/30 text-charcoal-grey rounded-full text-sm">
                +{property.amenities.length - 5} more
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
