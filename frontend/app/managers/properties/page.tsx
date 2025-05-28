"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { mockManagedProperties } from "@/lib/mock-users"
import { properties } from "@/lib/mock-data"
import { Building, Plus } from "lucide-react"
import Link from "next/link"
import PropertyManagementCard from "@/components/property-management-card"

export default function ManagerProperties() {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const [managedProperties, setManagedProperties] = useState([])

  useEffect(() => {
    if (currentUser) {
      // Get manager's properties
      const propertyIds = mockManagedProperties[currentUser] || []
      const managerProperties = properties.filter((prop) => propertyIds.includes(prop.id))
      setManagedProperties(managerProperties)
    }
  }, [currentUser])

  return (
    <DashboardLayout role="manager">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-neue font-bold text-2xl text-soft-black">My Properties</h1>
          <Button asChild>
            <Link href="/managers/add-property">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        {managedProperties.length > 0 ? (
          <div className="space-y-6">
            {managedProperties.map((property) => (
              <PropertyManagementCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-platinum-silver/10 rounded-lg">
            <Building className="h-12 w-12 text-warm-grey mx-auto mb-4" />
            <h2 className="font-neue font-semibold text-xl text-soft-black mb-2">No Properties Yet</h2>
            <p className="text-warm-grey mb-6 max-w-md mx-auto">
              You haven't added any properties yet. Add your first property to start receiving applications.
            </p>
            <Button asChild>
              <Link href="/managers/add-property">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Link>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
