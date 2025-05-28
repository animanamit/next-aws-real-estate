"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Search, X, MapPin, DollarSign, Home, Settings, Grid } from "lucide-react"
import { amenitiesList, propertyTypes } from "@/lib/mock-data"

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterState) => void
}

interface FilterState {
  location: string
  priceRange: [number, number]
  bedrooms: string
  bathrooms: string
  propertyTypes: string[]
  amenities: string[]
  squareFootage: [number, number]
}

const initialFilters: FilterState = {
  location: "",
  priceRange: [500, 10000],
  bedrooms: "any",
  bathrooms: "any",
  propertyTypes: [],
  amenities: [],
  squareFootage: [0, 5000],
}

export default function FilterSidebar({ isOpen, onClose, onApplyFilters }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [isLocationOpen, setIsLocationOpen] = useState(true)
  const [isPriceOpen, setIsPriceOpen] = useState(true)
  const [isRoomsOpen, setIsRoomsOpen] = useState(true)
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(true)
  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false)
  const [isSquareFootageOpen, setIsSquareFootageOpen] = useState(false)

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  const handleApplyFilters = () => {
    onApplyFilters(filters)
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  const handlePropertyTypeChange = (type: string) => {
    setFilters((prev) => {
      if (prev.propertyTypes.includes(type)) {
        return {
          ...prev,
          propertyTypes: prev.propertyTypes.filter((t) => t !== type),
        }
      } else {
        return {
          ...prev,
          propertyTypes: [...prev.propertyTypes, type],
        }
      }
    })
  }

  const handleAmenityChange = (amenity: string) => {
    setFilters((prev) => {
      if (prev.amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: prev.amenities.filter((a) => a !== amenity),
        }
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity],
        }
      }
    })
  }

  return (
    <div
      className={`fixed md:relative inset-0 z-40 bg-gray-50 md:bg-transparent transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="h-full md:h-auto overflow-y-auto p-6 md:p-0 w-full md:w-72 lg:w-80 bg-gray-50">
        <div className="flex items-center justify-between md:hidden mb-6">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Location */}
          <Collapsible
            open={isLocationOpen}
            onOpenChange={setIsLocationOpen}
            className="bg-white rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <h3 className="text-gray-900 font-medium">Location</h3>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400">
                  {isLocationOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="City, neighborhood"
                  className="pl-9"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Price Range */}
          <Collapsible
            open={isPriceOpen}
            onOpenChange={setIsPriceOpen}
            className="bg-white rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <h3 className="text-gray-900 font-medium">Price Range</h3>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400">
                  {isPriceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="space-y-4">
                <Slider
                  defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
                  max={10000}
                  min={500}
                  step={100}
                  onValueChange={(value) => setFilters({ ...filters, priceRange: [value[0], value[1]] })}
                  className="my-6"
                />
                <div className="flex items-center justify-between space-x-3">
                  <div className="flex-1">
                    <Label htmlFor="min-price" className="text-xs text-gray-600 mb-1">
                      Min Price
                    </Label>
                    <Input
                      id="min-price"
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: [Number.parseInt(e.target.value) || 0, filters.priceRange[1]],
                        })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="max-price" className="text-xs text-gray-600 mb-1">
                      Max Price
                    </Label>
                    <Input
                      id="max-price"
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: [filters.priceRange[0], Number.parseInt(e.target.value) || 10000],
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Bedrooms & Bathrooms */}
          <Collapsible
            open={isRoomsOpen}
            onOpenChange={setIsRoomsOpen}
            className="bg-white rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Home className="h-4 w-4 text-gray-400" />
                <h3 className="text-gray-900 font-medium">Rooms</h3>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400">
                  {isRoomsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms" className="text-xs text-gray-600 mb-1">
                    Bedrooms
                  </Label>
                  <Select
                    value={filters.bedrooms}
                    onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}
                  >
                    <SelectTrigger id="bedrooms">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="0">Studio</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bathrooms" className="text-xs text-gray-600 mb-1">
                    Bathrooms
                  </Label>
                  <Select
                    value={filters.bathrooms}
                    onValueChange={(value) => setFilters({ ...filters, bathrooms: value })}
                  >
                    <SelectTrigger id="bathrooms">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1+</SelectItem>
                      <SelectItem value="1.5">1.5+</SelectItem>
                      <SelectItem value="2">2+</SelectItem>
                      <SelectItem value="2.5">2.5+</SelectItem>
                      <SelectItem value="3">3+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Property Type */}
          <Collapsible
            open={isPropertyTypeOpen}
            onOpenChange={setIsPropertyTypeOpen}
            className="bg-white rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Grid className="h-4 w-4 text-gray-400" />
                <h3 className="text-gray-900 font-medium">Property Type</h3>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400">
                  {isPropertyTypeOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="grid grid-cols-2 gap-3">
                {propertyTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.propertyTypes.includes(type)}
                      onCheckedChange={() => handlePropertyTypeChange(type)}
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm text-gray-700 cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Amenities */}
          <Collapsible
            open={isAmenitiesOpen}
            onOpenChange={setIsAmenitiesOpen}
            className="bg-white rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-gray-400" />
                <h3 className="text-gray-900 font-medium">Amenities</h3>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400">
                  {isAmenitiesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                {amenitiesList.slice(0, 8).map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityChange(amenity)}
                    />
                    <Label htmlFor={`amenity-${amenity}`} className="text-sm text-gray-700 cursor-pointer">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Square Footage */}
          <Collapsible
            open={isSquareFootageOpen}
            onOpenChange={setIsSquareFootageOpen}
            className="bg-white rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Grid className="h-4 w-4 text-gray-400" />
                <h3 className="text-gray-900 font-medium">Square Footage</h3>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400">
                  {isSquareFootageOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="space-y-4">
                <Slider
                  defaultValue={[filters.squareFootage[0], filters.squareFootage[1]]}
                  max={5000}
                  min={0}
                  step={100}
                  onValueChange={(value) => setFilters({ ...filters, squareFootage: [value[0], value[1]] })}
                  className="my-6"
                />
                <div className="flex items-center justify-between space-x-3">
                  <div className="flex-1">
                    <Label htmlFor="min-sqft" className="text-xs text-gray-600 mb-1">
                      Min Sq Ft
                    </Label>
                    <Input
                      id="min-sqft"
                      type="number"
                      value={filters.squareFootage[0]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          squareFootage: [Number.parseInt(e.target.value) || 0, filters.squareFootage[1]],
                        })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="max-sqft" className="text-xs text-gray-600 mb-1">
                      Max Sq Ft
                    </Label>
                    <Input
                      id="max-sqft"
                      type="number"
                      value={filters.squareFootage[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          squareFootage: [filters.squareFootage[0], Number.parseInt(e.target.value) || 5000],
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
            <Button className="flex-1" onClick={handleApplyFilters}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}