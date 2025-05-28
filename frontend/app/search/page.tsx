"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import PropertyCard from "@/components/property-card"
import FilterSidebar from "@/components/filter-sidebar"
import { LocationSearch } from "@/components/location-search"
// import { properties } from "@/lib/mock-data"
import NavigationHeader from "@/components/navigation-header"
import Footer from "@/components/footer"
import { useFindPropertiesNearPointMutation, useGetPropertiesQuery } from "@/state/api"

export default function SearchPage() {
  const [viewType, setViewType] = useState<"grid" | "list">("grid")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchLocation, setSearchLocation] = useState<any>(null)
  const [isLocationSearch, setIsLocationSearch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingPage, setIsLoadingPage] = useState(false)
  const [filters, setFilters] = useState<any>({})
  
  const resultsPerPage = 12
  const [findPropertiesNearPoint] = useFindPropertiesNearPointMutation()
  
  // For general property search (with pagination)
  const {
    data: propertiesData,
    isLoading: isLoadingProperties,
    // isError: isPropertiesError // Unused variable
  } = useGetPropertiesQuery(
    { ...filters, page: currentPage, limit: resultsPerPage },
    { skip: isLocationSearch }
  )
  
  // For location-based search
  const [locationBasedProperties, setLocationBasedProperties] = useState<any[]>([])
  const [locationTotalResults, setLocationTotalResults] = useState(0)

  const handleApplyFilters = (newFilters: any) => {
    console.log("Applied filters:", newFilters)
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
    // Clear location search if regular filters are applied
    setIsLocationSearch(false)
    setLocationBasedProperties([])
    setSearchLocation(null)
  }

  const handleLocationSelect = (location: any) => {
    setSearchLocation(location)
    console.log("Selected location:", location)
  }

  const transformProperties = (properties: any[]) => {
    return properties.map((prop) => ({
      id: prop.id,
      title: prop.name || 'Property',
      description: prop.description || '',
      price: prop.pricePerMonth || 0,
      bedrooms: prop.beds || 0,
      bathrooms: prop.baths || 0,
      squareFeet: prop.squareFeet || 0,
      propertyType: prop.propertyType || 'Apartment',
      location: {
        address: prop.address || prop.location?.address || '',
        city: prop.city || prop.location?.city || '',
        state: prop.state || prop.location?.state || '',
        zip: prop.postalCode || prop.location?.postalCode || ''
      },
      availableFrom: new Date().toISOString().split('T')[0],
      amenities: prop.amenities || [],
      images: prop.photoUrls || [],
      isFeatured: false,
      propertyManager: {
        name: prop.manager?.name || 'Property Manager',
        phone: prop.manager?.phoneNumber || '(555) 123-4567',
        email: prop.manager?.email || 'manager@example.com',
        avatar: ''
      }
    }));
  }

  const handlePropertiesFound = async (properties: any[], searchMeta: any) => {
    const transformedProperties = transformProperties(properties);
    setLocationBasedProperties(transformedProperties)
    setIsLocationSearch(true)
    setCurrentPage(1)
    setLocationTotalResults(searchMeta?.total_count || transformedProperties.length)
    console.log("Found properties:", transformedProperties, searchMeta)
  }

  const loadLocationPage = async (page: number) => {
    if (!isLocationSearch || !searchLocation) {
      return;
    }

    setIsLoadingPage(true);
    setCurrentPage(page);

    try {
      const offset = (page - 1) * resultsPerPage;
      const propertiesResult = await findPropertiesNearPoint({
        centerPoint: searchLocation.coordinates,
        radiusKm: 10,
        limit: resultsPerPage,
        offset: offset
      }).unwrap();

      if (propertiesResult.success) {
        const transformedProperties = transformProperties(propertiesResult.data);
        setLocationBasedProperties(transformedProperties);
        if (propertiesResult.meta?.total_count !== undefined) {
          setLocationTotalResults(propertiesResult.meta.total_count);
        }
      }
    } catch (error) {
      console.error('Error loading location page:', error);
    } finally {
      setIsLoadingPage(false);
    }
  }

  const loadGeneralPage = (page: number) => {
    setCurrentPage(page);
    // The useGetPropertiesQuery will automatically refetch with the new page
  }

  // Determine current data and pagination info
  const displayProperties = isLocationSearch ? locationBasedProperties : (propertiesData?.properties ? transformProperties(propertiesData.properties) : [])
  const totalResults = isLocationSearch ? locationTotalResults : (propertiesData?.pagination?.total || 0)
  const totalPages = Math.ceil(totalResults / resultsPerPage)
  const startResult = totalResults > 0 ? ((currentPage - 1) * resultsPerPage) + 1 : 0
  const endResult = Math.min(currentPage * resultsPerPage, totalResults)
  const isLoading = isLocationSearch ? isLoadingPage : isLoadingProperties

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push('...');
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        if (totalPages > 4) {
          pages.push('...');
        }
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (isLocationSearch) {
      loadLocationPage(page);
    } else {
      loadGeneralPage(page);
    }
  }

  const clearLocationSearch = () => {
    setIsLocationSearch(false)
    setLocationBasedProperties([])
    setSearchLocation(null)
    setCurrentPage(1)
  }


  // Close filter sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsFilterOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-platinum-light flex flex-col">
      <NavigationHeader />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Location Search */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-muted-red" />
              <h2 className="text-lg font-medium text-gray-900">Search by Location</h2>
              {isLocationSearch && (
                <button
                  onClick={clearLocationSearch}
                  className="ml-auto text-sm text-muted-red hover:text-red-600 transition-colors"
                >
                  Clear location search
                </button>
              )}
            </div>
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              onPropertiesFound={handlePropertiesFound}
              placeholder="Enter city, address, or zip code..."
            />
            {searchLocation && (
              <div className="mt-3 text-sm text-gray-600">
                📍 Searching near: {searchLocation.address || `${searchLocation.city}, ${searchLocation.state}`}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="flex md:hidden justify-between items-center mb-4">
          <Button variant="default" className="bg-muted-red text-pure-white" onClick={() => setIsFilterOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewType === "grid" ? "default" : "outline"}
              size="icon"
              className={viewType === "grid" ? "bg-muted-red text-pure-white" : "border-muted-red text-muted-red"}
              onClick={() => setViewType("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === "list" ? "default" : "outline"}
              size="icon"
              className={viewType === "list" ? "bg-muted-red text-pure-white" : "border-muted-red text-muted-red"}
              onClick={() => setViewType("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <aside className="hidden md:block w-72 lg:w-80 shrink-0">
            <FilterSidebar
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApplyFilters={handleApplyFilters}
            />
          </aside>

          {/* Mobile Sidebar */}
          <div className="md:hidden">
            <FilterSidebar
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApplyFilters={handleApplyFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-4 p-3 bg-pure-white rounded">
              <div>
                <h1 className="font-space font-semibold text-lg text-soft-black">
                  {totalResults} Properties
                </h1>
                {isLocationSearch && searchLocation ? (
                  <p className="text-sm text-gray-600 mt-1">
                    Near {searchLocation.city || searchLocation.address}
                    {totalResults > resultsPerPage && (
                      <span> • Showing {startResult}-{endResult}</span>
                    )}
                  </p>
                ) : (
                  totalResults > resultsPerPage && (
                    <p className="text-sm text-gray-600 mt-1">
                      Showing {startResult}-{endResult}
                    </p>
                  )
                )}
                {isLoading && (
                  <p className="text-sm text-blue-600 mt-1">Loading...</p>
                )}
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <Button
                  variant={viewType === "grid" ? "default" : "outline"}
                  size="sm"
                  className={
                    viewType === "grid"
                      ? "bg-muted-red text-pure-white h-8"
                      : "h-8"
                  }
                  onClick={() => setViewType("grid")}
                >
                  <Grid className="h-3 w-3" />
                </Button>
                <Button
                  variant={viewType === "list" ? "default" : "outline"}
                  size="sm"
                  className={
                    viewType === "list"
                      ? "bg-muted-red text-pure-white h-8"
                      : "h-8"
                  }
                  onClick={() => setViewType("list")}
                >
                  <List className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Property Grid */}
            <div
              className={
                viewType === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"
              }
            >
              {displayProperties.map((property, index) => (
                <PropertyCard key={property.id || index} property={property} viewType={viewType} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-muted-red text-muted-red hover:bg-muted-red hover:text-pure-white"
                    disabled={currentPage <= 1 || isLoading}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((pageNum, index) => (
                    <React.Fragment key={index}>
                      {pageNum === '...' ? (
                        <span className="px-2 py-1 text-gray-400">...</span>
                      ) : (
                        <Button
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className={
                            currentPage === pageNum
                              ? "bg-muted-red text-pure-white hover:bg-coral-accent"
                              : "border-muted-red text-muted-red hover:bg-muted-red hover:text-pure-white"
                          }
                          disabled={isLoading}
                          onClick={() => handlePageChange(pageNum as number)}
                        >
                          {pageNum}
                        </Button>
                      )}
                    </React.Fragment>
                  ))}

                  {/* Next Button */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-muted-red text-muted-red hover:bg-muted-red hover:text-pure-white"
                    disabled={currentPage >= totalPages || isLoading}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Page Info */}
                <div className="ml-6 text-sm text-gray-600 flex items-center">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
