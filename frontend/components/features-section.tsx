import { Search, Shield, FileText, CreditCard, Users, Clock } from "lucide-react"
import type { FeatureCard } from "@/types"

const features: FeatureCard[] = [
  {
    icon: <Search className="h-8 w-8" />,
    title: "Easy Search",
    description: "Advanced filters to find exactly what you're looking for in seconds.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Verified Listings",
    description: "Every property is verified and photographed by our professional team.",
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Instant Applications",
    description: "Apply to multiple properties with one click using our streamlined process.",
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Secure Payments",
    description: "Bank-level security for all transactions and automatic rent payments.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Professional Management",
    description: "Experienced property managers handle maintenance and tenant relations.",
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "24/7 Support",
    description: "Round-the-clock assistance for any questions or emergency situations.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-12 bg-platinum-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl text-soft-black mb-3">Why Choose RentEase?</h2>
          <p className="text-charcoal-grey max-w-2xl mx-auto">
            We've built the most comprehensive platform to make renting simple, secure, and stress-free for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-pure-white hover:bg-platinum-silver transition-all duration-200"
            >
              <div className="text-muted-red mb-3">{feature.icon}</div>
              <h3 className="text-lg text-soft-black mb-2">{feature.title}</h3>
              <p className="text-charcoal-grey text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
