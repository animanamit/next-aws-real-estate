export interface User {
  id: string
  role: "tenant" | "manager"
  email: string
  name: string
  avatar: string
  phone?: string
  address?: string
  bio?: string
  createdAt: string
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
  status: "pending" | "approved" | "denied"
  message?: string
  appliedAt: string
  updatedAt: string
}

export interface Residence {
  id: string
  propertyId: string
  propertyTitle: string
  propertyImage: string
  managerId: string
  managerName: string
  tenantId: string
  leaseStart: string
  leaseEnd: string
  monthlyRent: number
  securityDeposit: number
  status: "active" | "ending" | "ended"
}

export const mockUsers: User[] = [
  {
    id: "user-001",
    role: "tenant",
    email: "alex@example.com",
    name: "Alex Johnson",
    avatar: "",
    phone: "(555) 123-4567",
    address: "123 Main St, Apt 4B, Metropolis, CA 90001",
    bio: "Young professional looking for a modern apartment in the downtown area.",
    createdAt: "2023-09-15T10:30:00Z",
  },
  {
    id: "user-002",
    role: "manager",
    email: "sarah@rentease.com",
    name: "Sarah Miller",
    avatar: "",
    phone: "(555) 987-6543",
    address: "456 Business Ave, Suite 200, Metropolis, CA 90002",
    bio: "Property manager with over 10 years of experience in residential leasing.",
    createdAt: "2022-05-20T14:15:00Z",
  },
  {
    id: "user-003",
    role: "tenant",
    email: "michael@example.com",
    name: "Michael Chen",
    avatar: "",
    phone: "(555) 234-5678",
    address: "789 Park Rd, Mountain Springs, CO 80302",
    bio: "Software engineer who enjoys hiking and outdoor activities.",
    createdAt: "2023-11-05T09:45:00Z",
  },
  {
    id: "user-004",
    role: "manager",
    email: "olivia@rentease.com",
    name: "Olivia Rodriguez",
    avatar: "",
    phone: "(555) 345-6789",
    address: "101 Luxury Lane, Coastal Haven, FL 33101",
    bio: "Specializing in luxury waterfront properties and high-end rentals.",
    createdAt: "2021-08-12T11:20:00Z",
  },
]

export const mockApplications: Application[] = [
  {
    id: "app-001",
    propertyId: "prop-001",
    propertyTitle: "Modern Luxury Apartment with City Views",
    propertyImage: "",
    tenantId: "user-001",
    tenantName: "Alex Johnson",
    tenantEmail: "alex@example.com",
    tenantPhone: "(555) 123-4567",
    status: "approved",
    message: "I'm very interested in this apartment and would like to schedule a viewing as soon as possible.",
    appliedAt: "2024-04-10T15:30:00Z",
    updatedAt: "2024-04-12T10:15:00Z",
  },
  {
    id: "app-002",
    propertyId: "prop-003",
    propertyTitle: "Spacious Townhouse with Garage",
    propertyImage: "",
    tenantId: "user-001",
    tenantName: "Alex Johnson",
    tenantEmail: "alex@example.com",
    tenantPhone: "(555) 123-4567",
    status: "pending",
    message: "Looking for a larger space with a garage. This townhouse seems perfect for my needs.",
    appliedAt: "2024-04-15T09:45:00Z",
    updatedAt: "2024-04-15T09:45:00Z",
  },
  {
    id: "app-003",
    propertyId: "prop-008",
    propertyTitle: "Mountain View Cottage",
    propertyImage: "",
    tenantId: "user-003",
    tenantName: "Michael Chen",
    tenantEmail: "michael@example.com",
    tenantPhone: "(555) 234-5678",
    status: "denied",
    message: "I love hiking and this location would be perfect. I have excellent rental history and references.",
    appliedAt: "2024-04-05T14:20:00Z",
    updatedAt: "2024-04-08T11:30:00Z",
  },
  {
    id: "app-004",
    propertyId: "prop-004",
    propertyTitle: "Luxury Waterfront Villa with Pool",
    propertyImage: "",
    tenantId: "user-003",
    tenantName: "Michael Chen",
    tenantEmail: "michael@example.com",
    tenantPhone: "(555) 234-5678",
    status: "pending",
    message: "Looking for a luxury property for a 12-month lease. Can provide all necessary documentation immediately.",
    appliedAt: "2024-04-18T16:10:00Z",
    updatedAt: "2024-04-18T16:10:00Z",
  },
]

export const mockResidences: Residence[] = [
  {
    id: "res-001",
    propertyId: "prop-001",
    propertyTitle: "Modern Luxury Apartment with City Views",
    propertyImage: "",
    managerId: "user-002",
    managerName: "Sarah Miller",
    tenantId: "user-001",
    leaseStart: "2024-05-01",
    leaseEnd: "2025-04-30",
    monthlyRent: 2500,
    securityDeposit: 2500,
    status: "active",
  },
  {
    id: "res-002",
    propertyId: "prop-007",
    propertyTitle: "Renovated Historic Apartment",
    propertyImage: "",
    managerId: "user-004",
    managerName: "Olivia Rodriguez",
    tenantId: "user-003",
    leaseStart: "2023-06-15",
    leaseEnd: "2024-06-14",
    monthlyRent: 1950,
    securityDeposit: 1950,
    status: "ending",
  },
]

// Mock favorites for tenants
export const mockFavorites = {
  "user-001": ["prop-004", "prop-008", "prop-010"],
  "user-003": ["prop-002", "prop-005", "prop-012"],
}

// Mock managed properties for managers
export const mockManagedProperties = {
  "user-002": ["prop-001", "prop-002", "prop-005", "prop-007"],
  "user-004": ["prop-003", "prop-004", "prop-008", "prop-010", "prop-012"],
}