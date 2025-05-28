"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import DashboardLayout from "@/components/dashboard-layout"
import { mockApplications } from "@/lib/mock-users"
import { FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ApplicationCard from "@/components/application-card"

export default function TenantApplications() {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const [applications, setApplications] = useState([])

  useEffect(() => {
    if (currentUser) {
      // Get tenant's applications
      const userApplications = mockApplications.filter((app) => app.tenantId === currentUser)
      setApplications(userApplications)
    }
  }, [currentUser])

  return (
    <DashboardLayout role="tenant">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-neue font-bold text-2xl text-soft-black">My Applications</h1>
          <Button asChild>
            <Link href="/search">
              <Search className="h-4 w-4 mr-2" />
              Browse Properties
            </Link>
          </Button>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} userRole="tenant" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-platinum-silver/10 rounded-lg">
            <FileText className="h-12 w-12 text-warm-grey mx-auto mb-4" />
            <h2 className="font-neue font-semibold text-xl text-soft-black mb-2">No Applications Yet</h2>
            <p className="text-warm-grey mb-6 max-w-md mx-auto">
              You haven't submitted any applications yet. Browse properties and apply to find your next home.
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
