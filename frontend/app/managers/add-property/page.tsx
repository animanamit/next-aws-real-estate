"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { PropertyCreationForm } from "@/components/property-creation-form"

interface UploadedImage {
  url: string;
  key: string;
  originalName: string;
  size: number;
}

interface PropertyFormData {
  name: string;
  description: string;
  pricePerMonth: number;
  securityDeposit: number;
  applicationFee: number;
  beds: number;
  baths: number;
  squareFeet: number;
  propertyType: string;
  isPetsAllowed: boolean;
  isParkingIncluded: boolean;
  amenities: string[];
  highlights: string[];
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export default function AddProperty() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: PropertyFormData & { images: UploadedImage[] }) => {
    setIsSubmitting(true)

    try {
      // Extract image URLs for the property
      const photoUrls = data.images.map(img => img.url)

      // Prepare the property data
      const propertyData = {
        name: data.name,
        description: data.description,
        pricePerMonth: data.pricePerMonth,
        securityDeposit: data.securityDeposit,
        applicationFee: data.applicationFee,
        photoUrls,
        amenities: data.amenities,
        highlights: data.highlights,
        isPetsAllowed: data.isPetsAllowed,
        isParkingIncluded: data.isParkingIncluded,
        beds: data.beds,
        baths: data.baths,
        squareFeet: data.squareFeet,
        propertyType: data.propertyType,
        // Location data will be created separately
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          // TODO: Get coordinates from address using geocoding
          coordinates: `POINT(-74.006 40.7128)` // Default to NYC for now
        }
      }

      console.log('Creating property:', propertyData)

      // TODO: Replace with actual API call when backend is ready
      const response = await fetch('http://localhost:3001/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create property')
      }

      const result = await response.json()
      console.log('Property created:', result)

      // Show success message
      alert('Property created successfully!')
      
      // Redirect to properties list
      router.push('/managers/properties')
    } catch (error) {
      console.error('Error creating property:', error)
      alert(error instanceof Error ? error.message : 'Failed to create property')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/managers/properties')
  }

  return (
    <DashboardLayout role="manager">
      <div className="p-6 bg-gray-50 min-h-screen">
        <PropertyCreationForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </DashboardLayout>
  )
}