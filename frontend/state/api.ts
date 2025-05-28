import { cleanParams, withToast } from "@/lib/utils";
import { Property, Tenant, Manager, Application, Lease, Payment } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FiltersState } from ".";

// Configuration - easily swap between mock and real API
const USE_MOCK_DATA = false; // Set to false when ready to use real API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

// Mock API responses - remove when switching to real API
import { mockProperties, mockManagers, mockTenants, mockApplications, mockLeases } from "@/lib/mockData";

// Mock delay to simulate network latency
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock implementations
const mockApi = {
  async getProperties(filters: any) {
    await mockDelay();
    let filteredProperties = [...mockProperties];
    
    // Apply basic filtering logic
    if (filters.location) {
      filteredProperties = filteredProperties.filter(p => 
        p.location.address.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.location.city.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.priceMin) {
      filteredProperties = filteredProperties.filter(p => p.pricePerMonth >= filters.priceMin);
    }
    
    if (filters.priceMax) {
      filteredProperties = filteredProperties.filter(p => p.pricePerMonth <= filters.priceMax);
    }
    
    if (filters.beds && filters.beds !== "any") {
      filteredProperties = filteredProperties.filter(p => p.beds >= parseInt(filters.beds));
    }
    
    if (filters.baths && filters.baths !== "any") {
      filteredProperties = filteredProperties.filter(p => p.baths >= parseInt(filters.baths));
    }
    
    if (filters.propertyType && filters.propertyType !== "any") {
      filteredProperties = filteredProperties.filter(p => p.propertyType === filters.propertyType);
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      filteredProperties = filteredProperties.filter(p => 
        filters.amenities.some((amenity: string) => p.amenities.includes(amenity))
      );
    }
    
    return filteredProperties;
  },
  
  async getProperty(id: number) {
    await mockDelay();
    const property = mockProperties.find(p => p.id === id);
    if (!property) throw new Error("Property not found");
    return property;
  },
  
  async getTenant(cognitoId: string) {
    await mockDelay();
    const tenant = mockTenants.find(t => t.cognitoId === cognitoId);
    if (!tenant) throw new Error("Tenant not found");
    return tenant;
  },
  
  async getManager(cognitoId: string) {
    await mockDelay();
    const manager = mockManagers.find(m => m.cognitoId === cognitoId);
    if (!manager) throw new Error("Manager not found");
    return manager;
  },
  
  async getApplications(params: any) {
    await mockDelay();
    return mockApplications.filter(app => {
      if (params.userId && params.userType === "tenant") {
        return app.tenantCognitoId === params.userId;
      }
      if (params.userId && params.userType === "manager") {
        const managerProperties = mockProperties.filter(p => p.managerCognitoId === params.userId);
        return managerProperties.some(p => p.id === app.propertyId);
      }
      return true;
    });
  },
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
      // When switching to real API, add authentication headers here
      // const session = await fetchAuthSession();
      // const { idToken } = session.tokens ?? {};
      // if (idToken) {
      //   headers.set("Authorization", `Bearer ${idToken}`);
      // }
      return headers;
    },
    responseHandler: async (response) => {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        console.log(`🔄 API Response [${response.url}]:`, data);
        return data;
      } catch (error) {
        console.log(`🔄 API Response [${response.url}] (text):`, text);
        return text;
      }
    },
  }),
  reducerPath: "api",
  tagTypes: [
    "Managers",
    "Tenants", 
    "Properties",
    "PropertyDetails",
    "Leases",
    "Payments",
    "Applications",
  ],
  endpoints: (build) => ({
    // Auth user endpoint
    getAuthUser: build.query<User, { demoMode?: boolean; demoRole?: string; demoUserId?: string }>({
      queryFn: async ({ demoMode = false, demoRole = "tenant", demoUserId }) => {
        if (USE_MOCK_DATA) {
          await mockDelay();
          // Mock authenticated user - you can change this for testing
          const mockUser = {
            cognitoInfo: { userId: "user123", signInDetails: { loginId: "test@example.com" } },
            userInfo: mockTenants[0], // Change to mockManagers[0] to test manager view
            userRole: "tenant", // Change to "manager" to test manager view
          };
          return { data: mockUser };
        }
        
        // Demo mode or regular auth
        let userRole: string;
        let cognitoId: string;
        
        if (demoMode && demoUserId) {
          userRole = demoRole;
          cognitoId = demoUserId;
          console.log(`🎭 Demo mode active - Role: ${userRole}, User: ${cognitoId}`);
        } else {
          // Fallback to default user when not in demo mode
          userRole = "tenant";
          cognitoId = "817b3540-a061-707b-742a-a28391181149"; // Carol White
          console.log(`👤 Regular mode - Default user: ${cognitoId}`);
        }
        
        try {
          const endpoint = userRole === "manager" ? `api/managers/${cognitoId}` : `api/tenants/${cognitoId}`;
          console.log(`🔐 Fetching auth user (${userRole}):`, cognitoId);
          console.log(`🔗 Auth endpoint:`, `${API_BASE_URL}/${endpoint}`);
          
          const response = await fetch(`${API_BASE_URL}/${endpoint}`);
          
          if (!response.ok) {
            console.error(`❌ Auth fetch failed:`, response.status, response.statusText);
            throw new Error("Failed to fetch user data");
          }
          
          const userInfo = await response.json();
          console.log(`✅ Auth user data fetched:`, userInfo);
          
          const authData = {
            cognitoInfo: { userId: cognitoId, signInDetails: { loginId: userInfo.email } },
            userInfo: userInfo as Tenant | Manager,
            userRole: userRole,
            isDemoMode: demoMode,
          };
          
          console.log(`🎯 Final auth data:`, authData);
          
          return { data: authData };
        } catch (error: any) {
          console.error(`❌ Auth error:`, error);
          return { error: error.message || "Could not fetch user data" };
        }
      },
    }),

    // Property endpoints
    getProperties: build.query<{properties: Property[], pagination: any}, Partial<FiltersState> & { favoriteIds?: number[]; page?: number; limit?: number }>({
      query: (filters) => {
        const params = cleanParams({
          city: filters.location,
          minPrice: filters.priceRange?.[0],
          maxPrice: filters.priceRange?.[1],
          beds: filters.beds !== "any" ? filters.beds : undefined,
          baths: filters.baths !== "any" ? filters.baths : undefined,
          propertyType: filters.propertyType !== "any" ? filters.propertyType : undefined,
          amenities: filters.amenities?.join(","),
          page: filters.page || 1,
          limit: filters.limit || 12,
        });
        
        console.log(`🔍 Fetching properties with filters:`, params);
        return { url: "api/properties", params };
      },
      transformResponse: (response: any) => {
        if (USE_MOCK_DATA) {
          // This won't be reached anymore, but kept for clarity
          return { properties: response, pagination: { page: 1, limit: 50, total: response.length, pages: 1 } };
        }
        
        // Real API response already has the correct structure
        console.log(`📊 Properties API response:`, response);
        return response;
      },
      providesTags: (result) =>
        result?.properties
          ? [
              ...result.properties.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch properties.",
        });
      },
    }),

    getProperty: build.query<Property, number>({
      queryFn: async (id) => {
        if (USE_MOCK_DATA) {
          const result = await mockApi.getProperty(id);
          return { data: result };
        }
        
        // Real API call
        console.log(`🏠 Fetching property details for ID:`, id);
        return { url: `api/properties/${id}` };
      },
      providesTags: (result, error, id) => [{ type: "PropertyDetails", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to load property details.",
        });
      },
    }),

    // Tenant endpoints
    getTenant: build.query<Tenant, string>({
      queryFn: async (cognitoId) => {
        if (USE_MOCK_DATA) {
          const result = await mockApi.getTenant(cognitoId);
          return { data: result };
        }
        
        // Real API call
        console.log(`👤 Fetching tenant data for:`, cognitoId);
        return { url: `api/tenants/${cognitoId}` };
      },
      providesTags: (result) => [{ type: "Tenants", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to load tenant profile.",
        });
      },
    }),

    getCurrentResidences: build.query<Property[], string>({
      queryFn: async (cognitoId) => {
        if (USE_MOCK_DATA) {
          await mockDelay();
          // Mock current residences - properties where tenant has active lease
          return { data: mockProperties.slice(0, 2) };
        }
        
        // Real API call - use tenant properties from their profile
        console.log(`🏘️ Fetching current residences for tenant:`, cognitoId);
        return { 
          url: `api/tenants/${cognitoId}`,
          transformResponse: (response: any) => {
            console.log(`🏘️ Tenant properties response:`, response.properties);
            return response.properties || [];
          }
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
    }),

    updateTenantSettings: build.mutation<Tenant, { cognitoId: string } & Partial<Tenant>>({
      queryFn: async ({ cognitoId, ...updatedTenant }) => {
        if (USE_MOCK_DATA) {
          await mockDelay();
          // Mock update - in real app this would update the database
          const existingTenant = mockTenants.find(t => t.cognitoId === cognitoId);
          if (!existingTenant) throw new Error("Tenant not found");
          
          const updated = { ...existingTenant, ...updatedTenant };
          return { data: updated };
        }
        
        // Real API call
        console.log(`✏️ Updating tenant settings for:`, cognitoId, updatedTenant);
        return {
          url: `api/tenants/${cognitoId}`,
          method: "PUT",
          body: updatedTenant,
        };
      },
      invalidatesTags: (result) => [{ type: "Tenants", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
        });
      },
    }),

    addFavoriteProperty: build.mutation<Tenant, { cognitoId: string; propertyId: number }>({
      queryFn: async ({ cognitoId, propertyId }) => {
        if (USE_MOCK_DATA) {
          await mockDelay();
          const tenant = mockTenants.find(t => t.cognitoId === cognitoId);
          if (!tenant) throw new Error("Tenant not found");
          
          // Mock adding to favorites
          return { data: tenant };
        }
        
        // Real API call
        console.log(`❤️ Adding favorite property ${propertyId} for tenant:`, cognitoId);
        return {
          url: `api/tenants/${cognitoId}/favorites/${propertyId}`,
          method: "POST",
        };
      },
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Added to favorites!",
          error: "Failed to add to favorites",
        });
      },
    }),

    removeFavoriteProperty: build.mutation<Tenant, { cognitoId: string; propertyId: number }>({
      queryFn: async ({ cognitoId, propertyId }) => {
        if (USE_MOCK_DATA) {
          await mockDelay();
          const tenant = mockTenants.find(t => t.cognitoId === cognitoId);
          if (!tenant) throw new Error("Tenant not found");
          
          return { data: tenant };
        }
        
        // Real API call
        console.log(`💔 Removing favorite property ${propertyId} for tenant:`, cognitoId);
        return {
          url: `api/tenants/${cognitoId}/favorites/${propertyId}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Removed from favorites!",
          error: "Failed to remove from favorites.",
        });
      },
    }),

    // Manager endpoints
    getManagerProperties: build.query<Property[], string>({
      queryFn: async (cognitoId) => {
        if (USE_MOCK_DATA) {
          await mockDelay();
          return { data: mockProperties.filter(p => p.managerCognitoId === cognitoId) };
        }
        
        // Real API call
        console.log(`🏢 Fetching manager properties for:`, cognitoId);
        return { url: `api/managers/${cognitoId}/properties` };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
    }),

    updateManagerSettings: build.mutation<Manager, { cognitoId: string } & Partial<Manager>>({
      queryFn: async ({ cognitoId, ...updatedManager }) => {
        if (USE_MOCK_DATA) {
          await mockDelay();
          const existingManager = mockManagers.find(m => m.cognitoId === cognitoId);
          if (!existingManager) throw new Error("Manager not found");
          
          const updated = { ...existingManager, ...updatedManager };
          return { data: updated };
        }
        
        // Real API call
        console.log(`✏️ Updating manager settings for:`, cognitoId, updatedManager);
        return {
          url: `api/managers/${cognitoId}`,
          method: "PUT",
          body: updatedManager,
        };
      },
      invalidatesTags: (result) => [{ type: "Managers", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Settings updated successfully!",
          error: "Failed to update settings.",
        });
      },
    }),

    createProperty: build.mutation<Property, FormData>({
      queryFn: async (newProperty) => {
        if (USE_MOCK_DATA) {
          await mockDelay();
          // Mock property creation
          const mockNewProperty: Property = {
            id: Math.max(...mockProperties.map(p => p.id)) + 1,
            name: "New Property",
            description: "A beautiful new property",
            pricePerMonth: 2500,
            securityDeposit: 2500,
            applicationFee: 50,
            photoUrls: ["/placeholder.jpg"],
            amenities: ["WiFi", "Parking"],
            highlights: ["GreatView"],
            isPetsAllowed: false,
            isParkingIncluded: true,
            beds: 2,
            baths: 2,
            squareFeet: 1200,
            propertyType: "Apartment",
            postedDate: new Date().toISOString(),
            averageRating: 0,
            numberOfReviews: 0,
            locationId: 1,
            managerCognitoId: "manager123",
            location: {
              id: 1,
              address: "123 New St",
              city: "San Francisco",
              state: "CA",
              country: "USA",
              postalCode: "94102",
              coordinates: { longitude: -122.4194, latitude: 37.7749 }
            },
            manager: mockManagers[0],
            leases: [],
            applications: [],
            favoritedBy: [],
            tenants: []
          };
          
          return { data: mockNewProperty };
        }
        
        // Real API call
        console.log(`🏗️ Creating new property:`, newProperty);
        return {
          url: `api/properties`,
          method: "POST",
          body: newProperty,
        };
      },
      invalidatesTags: (result) => [
        { type: "Properties", id: "LIST" },
        { type: "Managers", id: result?.manager?.id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Property created successfully!",
          error: "Failed to create property.",
        });
      },
    }),

    // Application endpoints
    getApplications: build.query<Application[], { userId?: string; userType?: string }>({
      queryFn: async (params) => {
        if (USE_MOCK_DATA) {
          const result = await mockApi.getApplications(params);
          return { data: result };
        }
        
        // Real API call
        const queryParams = new URLSearchParams();
        if (params.userId && params.userType === "tenant") {
          queryParams.append("tenantCognitoId", params.userId);
        }
        if (params.userId && params.userType === "manager") {
          queryParams.append("managerCognitoId", params.userId);
        }
        console.log(`📋 Fetching applications with params:`, Object.fromEntries(queryParams.entries()));
        return { url: `api/applications?${queryParams.toString()}` };
      },
      providesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Failed to fetch applications.",
        });
      },
    }),

    updateApplicationStatus: build.mutation<Application & { lease?: Lease }, { id: number; status: string }>({
      queryFn: async ({ id, status }) => {
        if (USE_MOCK_DATA) {
          await mockDelay();
          const application = mockApplications.find(app => app.id === id);
          if (!application) throw new Error("Application not found");
          
          const updated = { ...application, status: status as any };
          return { data: updated };
        }
        
        // Real API call
        console.log(`📝 Updating application ${id} status to:`, status);
        return {
          url: `api/applications/status/${id}`,
          method: "PUT",
          body: { status },
        };
      },
      invalidatesTags: ["Applications", "Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Application status updated successfully!",
          error: "Failed to update application status.",
        });
      },
    }),

    createApplication: build.mutation<Application, Partial<Application>>({
      queryFn: async (body) => {
        if (USE_MOCK_DATA) {
          await mockDelay();
          const newApplication: Application = {
            id: Math.max(...mockApplications.map(a => a.id)) + 1,
            applicationDate: new Date().toISOString(),
            status: "Pending",
            propertyId: body.propertyId || 1,
            tenantCognitoId: body.tenantCognitoId || "tenant123",
            name: body.name || "John Doe",
            email: body.email || "john@example.com",
            phoneNumber: body.phoneNumber || "123-456-7890",
            message: body.message || "",
            leaseId: null,
            property: mockProperties[0],
            tenant: mockTenants[0],
            lease: null
          };
          
          return { data: newApplication };
        }
        
        // Real API call
        console.log(`📤 Submitting new application:`, body);
        return {
          url: `api/applications`,
          method: "POST",
          body: body,
        };
      },
      invalidatesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Application submitted successfully!",
          error: "Failed to submit application.",
        });
      },
    }),

    // Upload endpoints
    uploadImages: build.mutation<{ success: boolean; data: any[] }, FormData>({
      query: (formData) => ({
        url: "api/upload/images",
        method: "POST",
        body: formData,
      }),
    }),

    uploadSingleImage: build.mutation<{ success: boolean; data: any }, FormData>({
      query: (formData) => ({
        url: "api/upload/image",
        method: "POST",
        body: formData,
      }),
    }),

    deleteImage: build.mutation<{ success: boolean; message: string }, string>({
      query: (imageKey) => ({
        url: `api/upload/image/${encodeURIComponent(imageKey)}`,
        method: "DELETE",
      }),
    }),

    getUploadConfig: build.query<{
      maxFileSize: number;
      allowedTypes: string[];
      maxFiles: number;
    }, void>({
      query: () => "api/upload/config",
    }),

    // Geospatial endpoints
    geocodeAddress: build.mutation<{
      success: boolean;
      data: {
        coordinates: { lat: number; lng: number };
        address: any;
      };
    }, {
      address: string;
      city: string;
      state: string;
      country: string;
    }>({
      query: (addressData) => ({
        url: "api/geo/geocode",
        method: "POST",
        body: addressData,
      }),
    }),

    findPropertiesNearPoint: build.mutation<{
      success: boolean;
      data: any[];
      meta: any;
    }, {
      centerPoint: { lat: number; lng: number };
      radiusKm: number;
      limit?: number;
      offset?: number;
    }>({
      query: (searchParams) => ({
        url: "api/geo/properties/near-point",
        method: "POST",
        body: searchParams,
      }),
    }),

    proximitySearch: build.mutation<{
      success: boolean;
      data: any[];
      meta: any;
    }, {
      centerPoint: { lat: number; lng: number };
      radiusKm: number;
      limit?: number;
      offset?: number;
      propertyType?: string;
      minPrice?: number;
      maxPrice?: number;
      beds?: number;
      baths?: number;
      amenities?: string[];
    }>({
      query: (searchParams) => ({
        url: "api/geo/properties/proximity-search",
        method: "POST",
        body: searchParams,
      }),
    }),

    findPropertiesInBounds: build.mutation<{
      success: boolean;
      data: any[];
      meta: any;
    }, {
      bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
      };
      filters?: {
        propertyType?: string;
        minPrice?: number;
        maxPrice?: number;
        beds?: number;
        baths?: number;
      };
    }>({
      query: (params) => ({
        url: "api/geo/properties/in-bounds",
        method: "POST",
        body: params,
      }),
    }),

    findNearestProperties: build.query<{
      success: boolean;
      data: any[];
      meta: any;
    }, {
      propertyId: number;
      radius?: number;
      limit?: number;
    }>({
      query: ({ propertyId, radius = 5, limit = 5 }) => 
        `api/geo/properties/${propertyId}/nearest?radius=${radius}&limit=${limit}`,
    }),

    calculateDistance: build.mutation<{
      success: boolean;
      data: {
        distance_meters: number;
        distance_km: number;
        distance_miles: number;
        point1: { lat: number; lng: number };
        point2: { lat: number; lng: number };
      };
    }, {
      point1: { lat: number; lng: number };
      point2: { lat: number; lng: number };
    }>({
      query: (points) => ({
        url: "api/geo/distance",
        method: "POST",
        body: points,
      }),
    }),

    searchPropertiesByLocation: build.query<{
      success: boolean;
      data: any[];
      meta: any;
    }, {
      q: string;
      radius?: number;
      limit?: number;
      offset?: number;
    }>({
      query: ({ q, radius = 10, limit = 20, offset = 0 }) =>
        `api/geo/properties/search-by-location?q=${encodeURIComponent(q)}&radius=${radius}&limit=${limit}&offset=${offset}`,
    }),
  }),
});

// User type definition for auth
interface User {
  cognitoInfo: any;
  userInfo: Tenant | Manager;
  userRole: string;
  isDemoMode?: boolean;
}

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useGetCurrentResidencesQuery,
  useGetManagerPropertiesQuery,
  useCreatePropertyMutation,
  useGetTenantQuery,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useCreateApplicationMutation,
  useUploadImagesMutation,
  useUploadSingleImageMutation,
  useDeleteImageMutation,
  useGetUploadConfigQuery,
  useGeocodeAddressMutation,
  useFindPropertiesNearPointMutation,
  useProximitySearchMutation,
  useFindPropertiesInBoundsMutation,
  useFindNearestPropertiesQuery,
  useCalculateDistanceMutation,
  useSearchPropertiesByLocationQuery,
} = api;