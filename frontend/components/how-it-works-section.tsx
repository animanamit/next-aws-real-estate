import { Search, UserCheck, Key } from "lucide-react"
import type { ProcessStep } from "@/types"

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Search & Discover",
    description: "Browse thousands of verified properties using our advanced search filters and virtual tours.",
    icon: <Search className="h-12 w-12" />,
  },
  {
    number: "02",
    title: "Apply & Connect",
    description: "Submit applications instantly and connect directly with property managers and landlords.",
    icon: <UserCheck className="h-12 w-12" />,
  },
  {
    number: "03",
    title: "Move In",
    description: "Complete secure payments, sign digital leases, and get your keys - all through our platform.",
    icon: <Key className="h-12 w-12" />,
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 bg-pure-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl text-soft-black mb-3">How It Works</h2>
          <p className="text-charcoal-grey max-w-2xl mx-auto">
            Get from searching to moving in with just three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-platinum-light hover:bg-platinum-silver transition-colors"
            >
              {/* Step Number */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted-red text-pure-white text-xl font-medium mb-6">
                {step.number}
              </div>

              {/* Icon */}
              <div className="text-charcoal-grey mb-6 flex justify-center">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-medium text-soft-black mb-3">{step.title}</h3>
              <p className="text-charcoal-grey leading-relaxed max-w-sm mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
