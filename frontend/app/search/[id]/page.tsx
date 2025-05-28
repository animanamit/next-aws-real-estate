"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { MapPin, Bed, Bath, Square, Calendar, DollarSign, Star, Heart, Share2, TrendingUp } from "lucide-react"
import NavigationHeader from "@/components/navigation-header"
import Footer from "@/components/footer"
import ImageGallery from "@/components/image-gallery"
import ContactWidget from "@/components/contact-widget"
import { NearbyProperties } from "@/components/nearby-properties"
import { type Property, properties } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call
    const propertyId = parseInt(params.id as string)
    const foundProperty = properties.find((p) => p.id === propertyId)
    setProperty(foundProperty || null)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavigationHeader />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavigationHeader />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-900 mb-4">Property Not Found</h1>
            <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
            <a
              href="/search"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Search
            </a>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const specs = [
    { icon: <Bed className="h-4 w-4" />, label: "Bedrooms", value: property.bedrooms },
    { icon: <Bath className="h-4 w-4" />, label: "Bathrooms", value: property.bathrooms },
    { icon: <Square className="h-4 w-4" />, label: "Sq Ft", value: property.squareFeet.toLocaleString() },
    { icon: <Calendar className="h-4 w-4" />, label: "Available", value: "Now" },
  ]

  const financials = [
    { label: "Monthly Rent", value: `$${property.price.toLocaleString()}`, desc: "Base rent", change: null },
    { label: "Security Deposit", value: `$${(property.price * 1.5).toLocaleString()}`, desc: "Refundable", change: null },
    { label: "Application Fee", value: "$75", desc: "Non-refundable", change: null },
    { label: "Total Move-in", value: `$${(property.price * 2.5 + 75).toLocaleString()}`, desc: "First month + deposit + fees", change: "+12% vs avg" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavigationHeader />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-medium text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-3xl font-medium text-gray-900">
                ${property.price.toLocaleString()}<span className="text-base font-normal text-gray-500">/month</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium text-gray-900">4.8</span>
                  <span className="text-sm text-gray-500">(24 reviews)</span>
                </div>
                {property.isFeatured && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Featured</span>
                )}
              </div>
            </div>
          </div>

          {/* Image Gallery or Placeholder */}
          {property.images && property.images.length > 0 ? (
            <ImageGallery images={property.images} title={property.title} />
          ) : (
            <div className="bg-white rounded-xl p-6">
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-gray-500 text-3xl">🏠</span>
                  </div>
                  <p className="text-gray-500 text-sm">Property Image</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Metrics - Dashboard Style */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map((spec, index) => (
                  <div key={index} className="bg-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">{spec.label}</span>
                      <div className="text-gray-400">{spec.icon}</div>
                    </div>
                    <div className="text-2xl font-medium text-gray-900">{spec.value}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2 py-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Location & Neighborhood</h2>
                <div className="flex items-start space-x-2 mb-4">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <p className="text-gray-600">
                    {property.location.address}, {property.location.city}, {property.location.state} {property.location.zip}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-500">Interactive map placeholder</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Contact Widget */}
              <ContactWidget property={property} />

              {/* Financial Breakdown - Dashboard Style */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Breakdown</h3>
                <div className="space-y-4">
                  {financials.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.label}</div>
                        <div className="text-xs text-gray-500">{item.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-medium text-gray-900">{item.value}</div>
                        {item.change && (
                          <div className="text-xs text-green-600">{item.change}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full">
                    Schedule Tour
                  </Button>
                  <Button variant="outline" className="w-full">
                    Apply Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Download Brochure
                  </Button>
                </div>
              </div>

              {/* Property Manager */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Property Manager</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">JD</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">John Davis</div>
                    <div className="text-sm text-gray-500">Licensed Property Manager</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Phone</span>
                    <span>(555) 123-4567</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email</span>
                    <span>john.davis@rentease.com</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rating</span>
                    <span className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span>4.9/5 (156 reviews)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby Properties Section */}
        <div className="mt-12">
          <NearbyProperties 
            propertyId={property.id} 
            radius={5} 
            limit={6} 
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}