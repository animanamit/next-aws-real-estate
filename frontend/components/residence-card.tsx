import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Residence } from "@/lib/mock-users"
import { Calendar, FileText, MessageCircle } from "lucide-react"

interface ResidenceCardProps {
  residence: Residence
}

export default function ResidenceCard({ residence }: ResidenceCardProps) {
  const statusColors = {
    active: "bg-green-500 text-white",
    ending: "bg-golden-accent text-soft-black",
    ended: "bg-warm-grey text-white",
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="border-2 border-platinum-silver overflow-hidden hover:border-muted-red transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 h-40 md:h-auto relative">
          <img
            src={residence.propertyImage || "/placeholder.svg"}
            alt={residence.propertyTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className={`${statusColors[residence.status]} font-medium text-sm px-3 py-1 tracking-tight`}>
              {residence.status.charAt(0).toUpperCase() + residence.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="flex-1 p-5 bg-linear-to-b from-platinum-silver/10 to-pure-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
            <h3 className="font-medium text-lg text-muted-red tracking-tight">{residence.propertyTitle}</h3>
          </div>

          <div className="mb-5 p-4 bg-platinum-silver/20 rounded-lg border-l-4 border-muted-red">
            <p className="text-charcoal-grey tracking-tight">
              <span className="font-medium text-muted-red">Property Manager:</span> {residence.managerName}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="p-4 bg-light-yellow/10 rounded-lg border-l-4 border-golden-accent">
              <p className="text-warm-grey text-xs mb-1">Lease Period</p>
              <p className="text-charcoal-grey font-medium font-space tracking-tight">
                {formatDate(residence.leaseStart)} - {formatDate(residence.leaseEnd)}
              </p>
            </div>
            <div className="p-4 bg-muted-red/10 rounded-lg border-l-4 border-coral-accent">
              <p className="text-warm-grey text-xs mb-1">Monthly Rent</p>
              <p className="font-space font-medium text-muted-red tracking-tight">
                ${residence.monthlyRent.toLocaleString()}
                <span className="text-xs text-warm-grey">/mo</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="default"
              size="sm"
              className="bg-muted-red hover:bg-coral-accent text-pure-white font-medium tracking-tight"
            >
              <FileText className="h-4 w-4 mr-1" />
              View Lease
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-golden-accent hover:bg-light-yellow text-soft-black font-medium tracking-tight"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Contact Manager
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-muted-red text-muted-red hover:bg-muted-red hover:text-pure-white font-medium tracking-tight"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Maintenance Request
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
