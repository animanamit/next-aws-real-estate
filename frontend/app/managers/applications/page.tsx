"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import type { Application, MockManagedProperties } from "@/types"
import DashboardLayout from "@/components/dashboard-layout"
import { mockApplications, mockManagedProperties } from "@/lib/mock-users"
import { FileText } from "lucide-react"
import ApplicationCard from "@/components/application-card"

export default function ManagerApplications() {
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    if (currentUser) {
      // Get manager's properties
      const propertyIds = (mockManagedProperties as MockManagedProperties)[currentUser] || []

      // Get applications for manager's properties
      const propertyApplications = mockApplications.filter((app) => propertyIds.includes(app.propertyId))
      setApplications(propertyApplications)
    }
  }, [currentUser])

  const handleApprove = (id: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: "approved", updatedAt: new Date().toISOString() } : app,
      ),
    )
  }

  const handleDeny = (id: string) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status: "denied", updatedAt: new Date().toISOString() } : app,
      ),
    )
  }

  return (
    <DashboardLayout role="manager">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-neue font-bold text-2xl text-soft-black">Property Applications</h1>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                userRole="manager"
                onApprove={handleApprove}
                onDeny={handleDeny}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-platinum-silver/10 rounded-lg">
            <FileText className="h-12 w-12 text-warm-grey mx-auto mb-4" />
            <h2 className="font-neue font-semibold text-xl text-soft-black mb-2">No Applications Yet</h2>
            <p className="text-warm-grey mb-6 max-w-md mx-auto">
              You haven&apos;t received any applications for your properties yet.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
