"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import DashboardLayout from "@/components/dashboard-layout"
import { mockResidences } from "@/lib/mock-users"
import type { Residence } from "@/types"
import { Building, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ResidenceCard from "@/components/residence-card"

export default function TenantResidences() {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const [residences, setResidences] = useState<Residence[]>([])

  useEffect(() => {
    if (currentUser) {
      // Get tenant's residences
      const userResidences = mockResidences.filter((res) => res.tenantId === currentUser)
      setResidences(userResidences)
    }
  }, [currentUser])

  return (
    <DashboardLayout role="tenant">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-neue font-bold text-2xl text-soft-black">Current Residences</h1>
          <Button asChild>
            <Link href="/search">
              <Search className="h-4 w-4 mr-2" />
              Browse Properties
            </Link>
          </Button>
        </div>

        {residences.length > 0 ? (
          <div className="space-y-6">
            {residences.map((residence) => (
              <ResidenceCard key={residence.id} residence={residence} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-platinum-silver/10 rounded-lg">
            <Building className="h-12 w-12 text-warm-grey mx-auto mb-4" />
            <h2 className="font-neue font-semibold text-xl text-soft-black mb-2">No Current Residences</h2>
            <p className="text-warm-grey mb-6 max-w-md mx-auto">
              You don't have any active leases at the moment. Browse properties and submit applications to find your
              next home.
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
