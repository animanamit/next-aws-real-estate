"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Mail, Phone } from "lucide-react"
import type { Property } from "@/lib/mock-data"
import ApplicationModal from "./application-modal"

interface ContactWidgetProps {
  property: Property
}

export default function ContactWidget({ property }: ContactWidgetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card className="border-platinum-silver">
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <Avatar className="mr-4">
              <AvatarFallback className="bg-blue-600 text-white">
                {property.propertyManager.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-neue font-semibold text-soft-black">{property.propertyManager.name}</h3>
              <p className="text-sm text-warm-grey">Property Manager</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-muted-red mr-3" />
              <span className="text-charcoal-grey">{property.propertyManager.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-muted-red mr-3" />
              <span className="text-charcoal-grey">{property.propertyManager.email}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-muted-red hover:bg-coral-accent text-pure-white"
              onClick={() => setIsModalOpen(true)}
            >
              Apply Now
            </Button>
            <Button
              variant="outline"
              className="w-full border-muted-red text-muted-red hover:bg-muted-red hover:text-pure-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Tour
            </Button>
          </div>
        </CardContent>
      </Card>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        propertyId={property.id.toString()}
        propertyTitle={property.title}
      />
    </>
  )
}
