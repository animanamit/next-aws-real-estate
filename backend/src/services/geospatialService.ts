import { PrismaClient, Prisma } from '@prisma/client';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationSearchParams {
  centerPoint: Coordinates;
  radiusKm: number;
  limit?: number;
  offset?: number;
}

export interface ProximitySearchParams extends LocationSearchParams {
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  amenities?: string[];
}

export interface GeoBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export class GeospatialService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Convert address to coordinates using a geocoding service
   * For now, returns a default coordinate - will be replaced with actual geocoding
   */
  async geocodeAddress(address: string, city: string, state: string, country: string): Promise<Coordinates> {
    // TODO: Integrate with actual geocoding service (Google Maps, MapBox, or OpenCage)
    // For now, return mock coordinates
    console.log(`🗺️ Geocoding address: ${address}, ${city}, ${state || 'N/A'}, ${country}`);
    
    // Mock geocoding - in production, use a real service
    const mockCoordinates: { [key: string]: Coordinates } = {
      'new york': { lat: 40.7128, lng: -74.0060 },
      'brooklyn': { lat: 40.6782, lng: -73.9442 },
      'manhattan': { lat: 40.7831, lng: -73.9712 },
      'queens': { lat: 40.7282, lng: -73.7949 },
      'chicago': { lat: 41.8781, lng: -87.6298 },
      'los angeles': { lat: 34.0522, lng: -118.2437 },
      'san francisco': { lat: 37.7749, lng: -122.4194 },
      'miami': { lat: 25.7617, lng: -80.1918 },
      'austin': { lat: 30.2672, lng: -97.7431 },
      'singapore': { lat: 1.3521, lng: 103.8198 },
      'london': { lat: 51.5074, lng: -0.1278 },
      'paris': { lat: 48.8566, lng: 2.3522 },
      'tokyo': { lat: 35.6762, lng: 139.6503 },
      'sydney': { lat: -33.8688, lng: 151.2093 },
      'toronto': { lat: 43.6532, lng: -79.3832 },
    };

    const cityKey = city.toLowerCase().replace(/\s+/g, ' ');
    const coordinates = mockCoordinates[cityKey] || { lat: 40.7128, lng: -74.0060 };
    
    // Add some random offset to make each property unique
    const randomOffset = 0.01; // ~1km variation
    const offsetLat = (Math.random() - 0.5) * randomOffset;
    const offsetLng = (Math.random() - 0.5) * randomOffset;
    
    return {
      lat: coordinates.lat + offsetLat,
      lng: coordinates.lng + offsetLng
    };
  }

  /**
   * Create a PostGIS POINT from coordinates
   */
  createPoint(coordinates: Coordinates): string {
    return `POINT(${coordinates.lng} ${coordinates.lat})`;
  }

  /**
   * Find properties within a radius of a point
   */
  async findPropertiesNearPoint(params: LocationSearchParams) {
    const { centerPoint, radiusKm, limit = 50, offset = 0 } = params;
    
    const centerPointWKT = this.createPoint(centerPoint);
    
    try {
      // First, let's try a simple query to see if there are any properties at all
      const allProperties = await this.prisma.property.findMany({
        include: {
          location: true
        },
        take: 10
      });
      
      console.log(`🔍 Found ${allProperties.length} total properties in database`);
      
      if (allProperties.length === 0) {
        console.log('🚨 No properties in database - returning empty array');
        return { properties: [], totalCount: 0 };
      }
      
      // First get the total count of properties within radius
      const totalCountResult = await this.prisma.$queryRaw<{ count: bigint }[]>`
        SELECT COUNT(*) as count
        FROM "Property" p
        INNER JOIN "Location" l ON p."locationId" = l.id
        WHERE ST_DWithin(
          l.coordinates,
          ST_GeomFromText(${centerPointWKT}, 4326),
          ${radiusKm * 1000}
        )
      `;
      
      const totalCount = Number(totalCountResult[0]?.count || 0);
      
      // Then get the paginated results
      const properties = await this.prisma.$queryRaw`
        SELECT 
          p.*,
          l.address,
          l.city,
          l.state,
          l.country,
          l."postalCode",
          ST_Distance(l.coordinates, ST_GeomFromText(${centerPointWKT}, 4326)) AS distance_meters,
          ST_X(l.coordinates::geometry) AS lng,
          ST_Y(l.coordinates::geometry) AS lat
        FROM "Property" p
        INNER JOIN "Location" l ON p."locationId" = l.id
        WHERE ST_DWithin(
          l.coordinates,
          ST_GeomFromText(${centerPointWKT}, 4326),
          ${radiusKm * 1000}
        )
        ORDER BY distance_meters ASC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
      
      console.log(`🎯 Found ${Array.isArray(properties) ? properties.length : 0} properties (of ${totalCount} total) within ${radiusKm}km`);
      return { properties, totalCount };
    } catch (error) {
      console.error('Error in findPropertiesNearPoint:', error);
      console.error('Center point WKT:', centerPointWKT);
      console.error('Search params:', params);
      throw new Error(`Failed to find properties near point: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Advanced proximity search with filters
   */
  async proximitySearch(params: ProximitySearchParams) {
    const { 
      centerPoint, 
      radiusKm, 
      limit = 50, 
      offset = 0,
      propertyType,
      minPrice,
      maxPrice,
      beds,
      baths,
      amenities = []
    } = params;
    
    const centerPointWKT = this.createPoint(centerPoint);
    
    // Build dynamic WHERE clauses
    let whereConditions = ['ST_DWithin(l.coordinates, ST_GeomFromText($1, 4326), $2)'];
    let queryParams: any[] = [centerPointWKT, radiusKm * 1000];
    let paramCount = 2;

    if (propertyType) {
      paramCount++;
      whereConditions.push(`p."propertyType" = $${paramCount}`);
      queryParams.push(propertyType);
    }

    if (minPrice !== undefined) {
      paramCount++;
      whereConditions.push(`p."pricePerMonth" >= $${paramCount}`);
      queryParams.push(minPrice);
    }

    if (maxPrice !== undefined) {
      paramCount++;
      whereConditions.push(`p."pricePerMonth" <= $${paramCount}`);
      queryParams.push(maxPrice);
    }

    if (beds !== undefined) {
      paramCount++;
      whereConditions.push(`p.beds >= $${paramCount}`);
      queryParams.push(beds);
    }

    if (baths !== undefined) {
      paramCount++;
      whereConditions.push(`p.baths >= $${paramCount}`);
      queryParams.push(baths);
    }

    if (amenities.length > 0) {
      paramCount++;
      whereConditions.push(`p.amenities && $${paramCount}`);
      queryParams.push(amenities);
    }

    const whereClause = whereConditions.join(' AND ');
    
    try {
      const query = `
        SELECT 
          p.*,
          l.address,
          l.city,
          l.state,
          l.country,
          l."postalCode",
          ST_Distance(l.coordinates, ST_GeomFromText($1, 4326)) AS distance_meters,
          ST_X(l.coordinates::geometry) AS lng,
          ST_Y(l.coordinates::geometry) AS lat
        FROM "Property" p
        INNER JOIN "Location" l ON p."locationId" = l.id
        WHERE ${whereClause}
        ORDER BY distance_meters ASC
        LIMIT $${paramCount + 1}
        OFFSET $${paramCount + 2}
      `;
      
      queryParams.push(limit, offset);
      
      const properties = await this.prisma.$queryRaw(
        Prisma.raw(query),
        ...queryParams
      );
      
      return properties;
    } catch (error) {
      console.error('Error in proximitySearch:', error);
      throw new Error('Failed to perform proximity search');
    }
  }

  /**
   * Find properties within geographic bounds (for map view)
   */
  async findPropertiesInBounds(bounds: GeoBounds, filters?: {
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
  }) {
    const { north, south, east, west } = bounds;
    
    // Create a bounding box polygon
    const boundingBox = `POLYGON((${west} ${south}, ${east} ${south}, ${east} ${north}, ${west} ${north}, ${west} ${south}))`;
    
    let whereConditions = ['ST_Within(l.coordinates, ST_GeomFromText($1, 4326))'];
    let queryParams: any[] = [boundingBox];
    let paramCount = 1;

    if (filters?.propertyType) {
      paramCount++;
      whereConditions.push(`p."propertyType" = $${paramCount}`);
      queryParams.push(filters.propertyType);
    }

    if (filters?.minPrice !== undefined) {
      paramCount++;
      whereConditions.push(`p."pricePerMonth" >= $${paramCount}`);
      queryParams.push(filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      paramCount++;
      whereConditions.push(`p."pricePerMonth" <= $${paramCount}`);
      queryParams.push(filters.maxPrice);
    }

    if (filters?.beds !== undefined) {
      paramCount++;
      whereConditions.push(`p.beds >= $${paramCount}`);
      queryParams.push(filters.beds);
    }

    if (filters?.baths !== undefined) {
      paramCount++;
      whereConditions.push(`p.baths >= $${paramCount}`);
      queryParams.push(filters.baths);
    }

    const whereClause = whereConditions.join(' AND ');
    
    try {
      const query = `
        SELECT 
          p.*,
          l.address,
          l.city,
          l.state,
          l.country,
          l."postalCode",
          ST_X(l.coordinates::geometry) AS lng,
          ST_Y(l.coordinates::geometry) AS lat
        FROM "Property" p
        INNER JOIN "Location" l ON p."locationId" = l.id
        WHERE ${whereClause}
        ORDER BY p.id
      `;
      
      const properties = await this.prisma.$queryRaw(
        Prisma.raw(query),
        ...queryParams
      );
      
      return properties;
    } catch (error) {
      console.error('Error in findPropertiesInBounds:', error);
      throw new Error('Failed to find properties in bounds');
    }
  }

  /**
   * Get nearest properties to a given property (for "similar properties" feature)
   */
  async findNearestProperties(propertyId: number, radiusKm: number = 5, limit: number = 5) {
    try {
      const properties = await this.prisma.$queryRaw`
        SELECT 
          p.*,
          l.address,
          l.city,
          l.state,
          l.country,
          l."postalCode",
          ST_Distance(l.coordinates, ref_location.coordinates) AS distance_meters,
          ST_X(l.coordinates::geometry) AS lng,
          ST_Y(l.coordinates::geometry) AS lat
        FROM "Property" p
        INNER JOIN "Location" l ON p."locationId" = l.id
        CROSS JOIN (
          SELECT coordinates 
          FROM "Location" 
          WHERE id = (SELECT "locationId" FROM "Property" WHERE id = ${propertyId})
        ) ref_location
        WHERE p.id != ${propertyId}
          AND ST_DWithin(l.coordinates, ref_location.coordinates, ${radiusKm * 1000})
        ORDER BY distance_meters ASC
        LIMIT ${limit}
      `;
      
      return properties;
    } catch (error) {
      console.error('Error in findNearestProperties:', error);
      throw new Error('Failed to find nearest properties');
    }
  }

  /**
   * Calculate distance between two points
   */
  async calculateDistance(point1: Coordinates, point2: Coordinates): Promise<number> {
    const point1WKT = this.createPoint(point1);
    const point2WKT = this.createPoint(point2);
    
    try {
      const result = await this.prisma.$queryRaw<{ distance: number }[]>`
        SELECT ST_Distance(
          ST_GeomFromText(${point1WKT}, 4326),
          ST_GeomFromText(${point2WKT}, 4326)
        ) AS distance
      `;
      
      return result[0]?.distance || 0;
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 0;
    }
  }

  /**
   * Update location coordinates for existing property
   */
  async updatePropertyLocation(locationId: number, coordinates: Coordinates) {
    const pointWKT = this.createPoint(coordinates);
    
    try {
      await this.prisma.$executeRaw`
        UPDATE "Location" 
        SET coordinates = ST_GeomFromText(${pointWKT}, 4326)
        WHERE id = ${locationId}
      `;
      
      return true;
    } catch (error) {
      console.error('Error updating property location:', error);
      throw new Error('Failed to update property location');
    }
  }
}

// Export a function to create the service with the shared prisma instance
export const createGeospatialService = (prisma: PrismaClient) => new GeospatialService(prisma);