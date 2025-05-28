import { Button } from "@/components/ui/button"
import { ArrowRight, Plus, Search } from "lucide-react"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-medium text-white mb-4">
            Ready to Find Your Next Home?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied renters who found their perfect home through RentEase. Start your search today
            or list your property with us.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100"
              asChild
            >
              <Link href="/search">
                <Search className="h-4 w-4 mr-2" />
                Find Properties
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              asChild
            >
              <Link href="/managers/add-property">
                <Plus className="h-4 w-4 mr-2" />
                List Your Property
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
