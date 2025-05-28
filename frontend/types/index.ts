import type { ReactNode } from "react"

// UI Component Types
export interface FeatureCard {
  icon: ReactNode
  title: string
  description: string
}

export interface ProcessStep {
  number: string
  title: string
  description: string
  icon: ReactNode
}

export interface NavigationItem {
  label: string
  href: string
}

// Core Entity Types
export interface Property {
  id: number
  title: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  propertyType: string
  photoUrls: string[]
  amenities: string[]
  highlights: string[]
  location: {
    address: string
    city: string
    state: string
    country: string
    coordinates: {
      lat: number
      lng: number
      latitude?: number
      longitude?: number
    }
  }
  // Backend compatibility fields
  name?: string
  pricePerMonth?: number
  beds?: number
  baths?: number
  locationId?: number
  managerCognitoId?: string
  createdAt?: string
  updatedAt?: string
  manager?: Manager
}

export interface Manager {
  id: number
  cognitoId: string
  firstName: string
  lastName: string
  name?: string // For UI compatibility
  email: string
  phoneNumber?: string
  companyName?: string
  licenseNumber?: string
  bio?: string
  profilePictureUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Tenant {
  id: number
  cognitoId: string
  firstName: string
  lastName: string
  name?: string // For UI compatibility
  email: string
  phoneNumber?: string
  dateOfBirth?: string
  employmentStatus?: string
  annualIncome?: number
  profilePictureUrl?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  createdAt: string
  updatedAt: string
}

export interface Application {
  id: string
  propertyId: string
  propertyTitle: string
  propertyImage: string
  tenantId: string
  tenantName: string
  tenantEmail: string
  tenantPhone: string
  status: 'pending' | 'approved' | 'denied'
  message?: string
  appliedAt: string
  updatedAt: string
  submittedAt?: string // For backend compatibility
  // Backend compatibility fields
  tenantCognitoId?: string
  moveInDate?: string
  leaseDuration?: number
  monthlyIncome?: number
  employmentStatus?: string
  previousAddress?: string
  reasonForMoving?: string
  petInformation?: string
  additionalNotes?: string
  // Relations
  property?: Property
  tenant?: Tenant
}

export interface Lease {
  id: number
  propertyId: number
  tenantCognitoId: string
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit: number
  leaseTerm: number
  status: 'active' | 'expired' | 'terminated'
  specialTerms?: string
  createdAt: string
  updatedAt: string
  // Relations
  property?: Property
  tenant?: Tenant
}

export interface Payment {
  id: number
  leaseId: number
  amount: number
  paymentType: 'rent' | 'deposit' | 'fee' | 'utility'
  paymentMethod: 'credit_card' | 'bank_transfer' | 'check' | 'cash'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  dueDate: string
  paidDate?: string
  description?: string
  receiptUrl?: string
  createdAt: string
  updatedAt: string
  // Relations
  lease?: Lease
}

export interface Residence {
  id: number
  property: Property
  lease: Lease
  moveInDate: string
  isActive: boolean
}

// Filter and Search Types
export interface FiltersState {
  location: string
  beds: string
  baths: string
  propertyType: string
  amenities: string[]
  priceRange: [number, number] | [null, null]
  squareFeet: [number, number] | [null, null]
  coordinates: [number, number]
}

// Mock Data Types
export interface MockManagedProperties {
  [key: string]: string[]
}

export interface MockFavorites {
  [key: string]: string[]
}

// Demo Mode Types
export interface DemoUser {
  id: string
  role: 'tenant' | 'manager'
  name: string
  email: string
}

// User Type for Authentication
export interface User {
  id: string
  email: string
  role: 'tenant' | 'manager'
  name: string
  cognitoId: string
}
