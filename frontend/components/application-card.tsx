"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Application } from "@/lib/mock-users"
import { formatDistanceToNow } from "date-fns"
import { Check, X } from "lucide-react"

interface ApplicationCardProps {
  application: Application
  userRole: "tenant" | "manager"
  onApprove?: (id: string) => void
  onDeny?: (id: string) => void
}

export default function ApplicationCard({ application, userRole, onApprove, onDeny }: ApplicationCardProps) {
  const statusColors = {
    pending: "bg-golden-accent text-soft-black",
    approved: "bg-green-500 text-white",
    denied: "bg-muted-red text-white",
  }

  const formattedDate = formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })

  return (
    <Card className="border-2 border-platinum-silver overflow-hidden hover:border-muted-red transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-40 md:h-auto relative">
          {application.propertyImage ? (
            <img
              src={application.propertyImage}
              alt={application.propertyTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-platinum-silver/40 flex items-center justify-center">
              <div className="w-12 h-12 bg-warm-grey/30 rounded-full flex items-center justify-center">
                <span className="text-warm-grey text-xl">🏠</span>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className={`${statusColors[application.status]} font-medium text-sm px-3 py-1 tracking-tight`}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="flex-1 p-5 bg-linear-to-b from-platinum-silver/10 to-pure-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
            <h3 className="font-medium text-lg text-muted-red tracking-tight">{application.propertyTitle}</h3>
          </div>

          <div className="mb-4">
            <p className="text-xs text-warm-grey font-space">Applied {formattedDate}</p>
          </div>

          {userRole === "manager" && (
            <div className="mb-5 p-4 bg-platinum-silver/20 rounded-lg border-l-4 border-muted-red">
              <p className="text-charcoal-grey mb-1 tracking-tight">
                <span className="font-medium text-muted-red">Applicant:</span> {application.tenantName}
              </p>
              <p className="text-charcoal-grey mb-1 tracking-tight">
                <span className="font-medium text-muted-red">Email:</span> {application.tenantEmail}
              </p>
              <p className="text-charcoal-grey tracking-tight">
                <span className="font-medium text-muted-red">Phone:</span>{" "}
                <span className="font-space">{application.tenantPhone}</span>
              </p>
            </div>
          )}

          {application.message && (
            <div className="mb-5 p-4 bg-light-yellow/10 rounded-lg border-l-4 border-golden-accent">
              <p className="text-sm text-charcoal-grey italic tracking-tight">"{application.message}"</p>
            </div>
          )}

          {userRole === "manager" && application.status === "pending" && (
            <div className="flex space-x-3 mt-5">
              <Button
                variant="default"
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white font-medium tracking-tight"
                onClick={() => onApprove && onApprove(application.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-muted-red hover:bg-coral-accent text-white font-medium tracking-tight"
                onClick={() => onDeny && onDeny(application.id)}
              >
                <X className="h-4 w-4 mr-1" />
                Deny
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
