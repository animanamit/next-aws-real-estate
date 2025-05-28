import { Property, Manager, Tenant, Application, Lease, Payment } from "@/types";

// Mock Managers
export const mockManagers: Manager[] = [
  {
    id: 1,
    cognitoId: "manager123",
    firstName: "Sarah",
    lastName: "Johnson",
    name: "Sarah Johnson",
    email: "sarah.johnson@realtyco.com",
    phoneNumber: "(555) 123-4567",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    cognitoId: "manager456",
    firstName: "Michael",
    lastName: "Chen",
    name: "Michael Chen",
    email: "michael.chen@premiumproperties.com",
    phoneNumber: "(555) 987-6543",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// Mock Tenants
export const mockTenants: Tenant[] = [
  {
    id: 1,
    cognitoId: "tenant123",
    firstName: "Alex",
    lastName: "Rivera",
    name: "Alex Rivera",
    email: "alex.rivera@email.com",
    phoneNumber: "(555) 234-5678",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    cognitoId: "tenant456",
    firstName: "Emma",
    lastName: "Thompson",
    name: "Emma Thompson",
    email: "emma.thompson@email.com",
    phoneNumber: "(555) 345-6789",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// Mock Properties
export const mockProperties: Property[] = [
  {
    id: 1,
    name: "Modern Downtown Loft",
    description: "Stunning modern loft in the heart of downtown with floor-to-ceiling windows, exposed brick walls, and premium finishes throughout. This unique space offers an open-concept living area perfect for entertaining, with a gourmet kitchen featuring stainless steel appliances and granite countertops.",
    pricePerMonth: 3200,
    securityDeposit: 3200,
    applicationFee: 75,
    photoUrls: [
      "/placeholder.jpg",
      "/placeholder.jpg",
      "/placeholder.jpg"
    ],
    amenities: ["WiFi", "Parking", "Gym", "Pool"],
    highlights: ["GreatView", "RecentlyRenovated", "CloseToTransit"],
    isPetsAllowed: false,
    isParkingIncluded: true,
    beds: 2,
    baths: 2,
    squareFeet: 1400,
    propertyType: "Apartment",
    postedDate: "2024-01-15T10:00:00Z",
    averageRating: 4.8,
    numberOfReviews: 12,
    locationId: 1,
    managerCognitoId: "manager123",
    location: {
      id: 1,
      address: "123 Main Street, Unit 4B",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94102",
      coordinates: { lat: 37.7749, lng: -122.4194, latitude: 37.7749, longitude: -122.4194 }
    },
    manager: mockManagers[0],
    leases: [],
    applications: [],
    favoritedBy: [],
    tenants: []
  },
  {
    id: 2,
    name: "Charming Victorian House",
    description: "Beautiful Victorian-era house with original architectural details, hardwood floors, and a private garden. Located in a quiet residential neighborhood with easy access to public transportation and local amenities.",
    pricePerMonth: 4500,
    securityDeposit: 4500,
    applicationFee: 100,
    photoUrls: [
      "/placeholder.jpg",
      "/placeholder.jpg"
    ],
    amenities: ["WiFi", "WasherDryer", "PetsAllowed", "HardwoodFloors"],
    highlights: ["QuietNeighborhood", "GreatView", "RecentlyRenovated"],
    isPetsAllowed: true,
    isParkingIncluded: false,
    beds: 3,
    baths: 2.5,
    squareFeet: 2200,
    propertyType: "Villa",
    postedDate: "2024-01-10T14:30:00Z",
    averageRating: 4.6,
    numberOfReviews: 8,
    locationId: 2,
    managerCognitoId: "manager123",
    location: {
      id: 2,
      address: "456 Oak Avenue",
      city: "San Francisco",
      state: "CA", 
      country: "USA",
      postalCode: "94117",
      coordinates: { lat: 37.7697, lng: -122.4477, latitude: 37.7697, longitude: -122.4477 }
    },
    manager: mockManagers[0],
    leases: [],
    applications: [],
    favoritedBy: [],
    tenants: []
  },
  {
    id: 3,
    name: "Luxury High-Rise Studio",
    description: "Sophisticated studio apartment in a luxury high-rise building with panoramic city views, modern amenities, and 24/7 concierge service. Perfect for young professionals seeking a premium urban lifestyle.",
    pricePerMonth: 2800,
    securityDeposit: 2800,
    applicationFee: 50,
    photoUrls: [
      "/placeholder.jpg"
    ],
    amenities: ["WiFi", "Gym", "Pool", "AirConditioning"],
    highlights: ["GreatView", "CloseToTransit", "HighSpeedInternetAccess"],
    isPetsAllowed: false,
    isParkingIncluded: true,
    beds: 0,
    baths: 1,
    squareFeet: 650,
    propertyType: "Apartment",
    postedDate: "2024-01-20T09:15:00Z",
    averageRating: 4.9,
    numberOfReviews: 15,
    locationId: 3,
    managerCognitoId: "manager456",
    location: {
      id: 3,
      address: "789 Financial District Plaza, Floor 25",
      city: "San Francisco",
      state: "CA",
      country: "USA", 
      postalCode: "94111",
      coordinates: { lat: 37.7928, lng: -122.3962, latitude: 37.7928, longitude: -122.3962 }
    },
    manager: mockManagers[1],
    leases: [],
    applications: [],
    favoritedBy: [],
    tenants: []
  },
  {
    id: 4,
    name: "Cozy Townhouse",
    description: "Spacious townhouse with private entrance, backyard, and garage. Features modern updates while maintaining original charm. Great for families or roommates looking for more space and privacy.",
    pricePerMonth: 3800,
    securityDeposit: 3800,
    applicationFee: 75,
    photoUrls: [
      "/placeholder.jpg",
      "/placeholder.jpg",
      "/placeholder.jpg",
      "/placeholder.jpg"
    ],
    amenities: ["WiFi", "Parking", "WasherDryer", "PetsAllowed"],
    highlights: ["QuietNeighborhood", "Heating", "WasherDryer"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 3,
    baths: 2.5,
    squareFeet: 1800,
    propertyType: "Townhouse",
    postedDate: "2024-01-05T16:45:00Z",
    averageRating: 4.7,
    numberOfReviews: 6,
    locationId: 4,
    managerCognitoId: "manager456",
    location: {
      id: 4,
      address: "321 Sunset Boulevard",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94122", 
      coordinates: { lat: 37.7596, lng: -122.4683, latitude: 37.7596, longitude: -122.4683 }
    },
    manager: mockManagers[1],
    leases: [],
    applications: [],
    favoritedBy: [],
    tenants: []
  },
  {
    id: 5,
    name: "Affordable Studio Apartment",
    description: "Clean and efficient studio apartment perfect for students or young professionals. Features a modern kitchenette, full bathroom, and good natural light. Located near public transportation and universities.",
    pricePerMonth: 1950,
    securityDeposit: 1950,
    applicationFee: 25,
    photoUrls: [
      "/placeholder.jpg"
    ],
    amenities: ["WiFi", "HardwoodFloors"],
    highlights: ["CloseToTransit", "SmokeFree"],
    isPetsAllowed: false,
    isParkingIncluded: false,
    beds: 0,
    baths: 1,
    squareFeet: 450,
    propertyType: "Apartment",
    postedDate: "2024-01-25T11:20:00Z",
    averageRating: 4.3,
    numberOfReviews: 4,
    locationId: 5,
    managerCognitoId: "manager123",
    location: {
      id: 5,
      address: "555 University Drive, Apt 2A",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94132",
      coordinates: { lat: 37.7172, lng: -122.4821, latitude: 37.7172, longitude: -122.4821 }
    },
    manager: mockManagers[0],
    leases: [],
    applications: [],
    favoritedBy: [],
    tenants: []
  },
  {
    id: 6,
    name: "Family-Friendly Cottage",
    description: "Charming cottage with front and back yards, perfect for families with children. Features 4 bedrooms, 2 full bathrooms, and a large kitchen with dining area. Quiet neighborhood with good schools nearby.",
    pricePerMonth: 4200,
    securityDeposit: 4200,
    applicationFee: 100,
    photoUrls: [
      "/placeholder.jpg",
      "/placeholder.jpg",
      "/placeholder.jpg"
    ],
    amenities: ["WiFi", "WasherDryer", "PetsAllowed", "Parking"],
    highlights: ["QuietNeighborhood", "GreatView", "SmokeFree"],
    isPetsAllowed: true,
    isParkingIncluded: true,
    beds: 4,
    baths: 2,
    squareFeet: 2000,
    propertyType: "Cottage",
    postedDate: "2024-01-12T13:30:00Z",
    averageRating: 4.5,
    numberOfReviews: 9,
    locationId: 6,
    managerCognitoId: "manager456",
    location: {
      id: 6,
      address: "777 Family Lane",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      postalCode: "94124",
      coordinates: { lat: 37.7335, lng: -122.3735, latitude: 37.7335, longitude: -122.3735 }
    },
    manager: mockManagers[1],
    leases: [],
    applications: [],
    favoritedBy: [],
    tenants: []
  }
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: "1",
    propertyTitle: "Luxury Downtown Loft",
    propertyImage: "/placeholder.jpg",
    tenantId: "tenant123",
    tenantName: "Alex Rivera",
    tenantEmail: "alex.rivera@email.com",
    tenantPhone: "(555) 234-5678",
    appliedAt: "2024-01-28T10:00:00Z",
    updatedAt: "2024-01-28T10:00:00Z",
    status: "pending",
    propertyId: "1",
    message: "Very interested in this property. I work remotely and would love the downtown location."
  },
  {
    id: "2",
    propertyTitle: "Modern 2BR Apartment",
    propertyImage: "/placeholder.jpg",
    tenantId: "tenant456",
    tenantName: "Emma Thompson",
    tenantEmail: "emma.thompson@email.com",
    tenantPhone: "(555) 345-6789",
    appliedAt: "2024-01-26T14:30:00Z",
    updatedAt: "2024-01-26T14:30:00Z",
    status: "approved",
    propertyId: "2",
    message: "Looking for a long-term rental. I have excellent references and stable income."
  },
  {
    id: "3",
    propertyTitle: "Cozy Studio",
    propertyImage: "/placeholder.jpg",
    tenantId: "tenant123",
    tenantName: "Alex Rivera",
    tenantEmail: "alex.rivera@email.com",
    tenantPhone: "(555) 234-5678",
    appliedAt: "2024-01-24T09:15:00Z",
    updatedAt: "2024-01-24T09:15:00Z",
    status: "denied",
    propertyId: "3",
    message: "Interested in the studio for immediate move-in."
  }
];

// Mock Leases
export const mockLeases: Lease[] = [
  {
    id: 1,
    propertyId: 2,
    tenantCognitoId: "tenant456",
    startDate: "2024-02-01T00:00:00Z",
    endDate: "2025-01-31T23:59:59Z",
    monthlyRent: 4500,
    securityDeposit: 4500,
    leaseTerm: 12,
    status: "active",
    createdAt: "2024-01-26T00:00:00Z",
    updatedAt: "2024-01-26T00:00:00Z"
  }
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: 1,
    leaseId: 1,
    amount: 4500,
    paymentType: "rent",
    paymentMethod: "bank_transfer",
    status: "completed",
    dueDate: "2024-02-01T00:00:00Z",
    paidDate: "2024-01-30T10:30:00Z",
    createdAt: "2024-01-26T00:00:00Z",
    updatedAt: "2024-01-30T10:30:00Z"
  },
  {
    id: 2,
    leaseId: 1,
    amount: 4500,
    paymentType: "rent",
    paymentMethod: "bank_transfer",
    status: "pending",
    dueDate: "2024-03-01T00:00:00Z",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z"
  }
];

// Update property references
mockProperties[0].manager = mockManagers[0];
mockProperties[1].manager = mockManagers[0];
mockProperties[2].manager = mockManagers[1];
mockProperties[3].manager = mockManagers[1];
mockProperties[4].manager = mockManagers[0];
mockProperties[5].manager = mockManagers[1];