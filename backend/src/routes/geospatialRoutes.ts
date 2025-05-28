import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createGeospatialService, Coordinates, LocationSearchParams, ProximitySearchParams, GeoBounds } from '../services/geospatialService';
import { prisma } from '../index';

export async function geospatialRoutes(fastify: FastifyInstance) {
  
  // Create geospatial service with shared prisma instance
  const geospatialService = createGeospatialService(prisma);
  
  // Geocode an address to coordinates
  fastify.post('/geocode', async (request: FastifyRequest<{
    Body: {
      address: string;
      city: string;
      state: string;
      country: string;
    }
  }>, reply: FastifyReply) => {
    try {
      const { address, city, state, country } = request.body;
      
      if (!city) {
        return reply.status(400).send({
          error: 'City is required'
        });
      }
      
      const coordinates = await geospatialService.geocodeAddress(address, city, state, country);
      
      reply.send({
        success: true,
        data: {
          coordinates,
          address: { address, city, state, country }
        }
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      reply.status(500).send({
        error: 'Failed to geocode address',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Find properties near a point
  fastify.post('/properties/near-point', async (request: FastifyRequest<{
    Body: LocationSearchParams
  }>, reply: FastifyReply) => {
    try {
      const { centerPoint, radiusKm, limit, offset } = request.body;
      
      if (!centerPoint || !centerPoint.lat || !centerPoint.lng || !radiusKm) {
        return reply.status(400).send({
          error: 'centerPoint (lat, lng) and radiusKm are required'
        });
      }
      
      const result = await geospatialService.findPropertiesNearPoint({
        centerPoint,
        radiusKm,
        limit,
        offset
      });
      
      reply.send({
        success: true,
        data: result.properties,
        meta: {
          center: centerPoint,
          radius_km: radiusKm,
          total_count: result.totalCount,
          count: Array.isArray(result.properties) ? result.properties.length : 0,
          limit,
          offset
        }
      });
    } catch (error) {
      console.error('Near point search error:', error);
      reply.status(500).send({
        error: 'Failed to find properties near point',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Advanced proximity search with filters
  fastify.post('/properties/proximity-search', async (request: FastifyRequest<{
    Body: ProximitySearchParams
  }>, reply: FastifyReply) => {
    try {
      const searchParams = request.body;
      
      if (!searchParams.centerPoint || !searchParams.radiusKm) {
        return reply.status(400).send({
          error: 'centerPoint and radiusKm are required'
        });
      }
      
      const properties = await geospatialService.proximitySearch(searchParams);
      
      reply.send({
        success: true,
        data: properties,
        meta: {
          search_params: searchParams,
          count: Array.isArray(properties) ? properties.length : 0
        }
      });
    } catch (error) {
      console.error('Proximity search error:', error);
      reply.status(500).send({
        error: 'Failed to perform proximity search',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Find properties within geographic bounds (for map view)
  fastify.post('/properties/in-bounds', async (request: FastifyRequest<{
    Body: {
      bounds: GeoBounds;
      filters?: {
        propertyType?: string;
        minPrice?: number;
        maxPrice?: number;
        beds?: number;
        baths?: number;
      }
    }
  }>, reply: FastifyReply) => {
    try {
      const { bounds, filters } = request.body;
      
      if (!bounds || typeof bounds.north !== 'number' || typeof bounds.south !== 'number' ||
          typeof bounds.east !== 'number' || typeof bounds.west !== 'number') {
        return reply.status(400).send({
          error: 'Valid bounds (north, south, east, west) are required'
        });
      }
      
      const properties = await geospatialService.findPropertiesInBounds(bounds, filters);
      
      reply.send({
        success: true,
        data: properties,
        meta: {
          bounds,
          filters,
          count: Array.isArray(properties) ? properties.length : 0
        }
      });
    } catch (error) {
      console.error('Bounds search error:', error);
      reply.status(500).send({
        error: 'Failed to find properties in bounds',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Find nearest properties to a given property
  fastify.get('/properties/:propertyId/nearest', async (request: FastifyRequest<{
    Params: { propertyId: string };
    Querystring: { radius?: string; limit?: string }
  }>, reply: FastifyReply) => {
    try {
      const propertyId = parseInt(request.params.propertyId);
      const radiusKm = request.query.radius ? parseFloat(request.query.radius) : 5;
      const limit = request.query.limit ? parseInt(request.query.limit) : 5;
      
      if (isNaN(propertyId)) {
        return reply.status(400).send({
          error: 'Valid property ID is required'
        });
      }
      
      const properties = await geospatialService.findNearestProperties(propertyId, radiusKm, limit);
      
      reply.send({
        success: true,
        data: properties,
        meta: {
          reference_property_id: propertyId,
          radius_km: radiusKm,
          limit,
          count: Array.isArray(properties) ? properties.length : 0
        }
      });
    } catch (error) {
      console.error('Nearest properties error:', error);
      reply.status(500).send({
        error: 'Failed to find nearest properties',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Calculate distance between two points
  fastify.post('/distance', async (request: FastifyRequest<{
    Body: {
      point1: Coordinates;
      point2: Coordinates;
    }
  }>, reply: FastifyReply) => {
    try {
      const { point1, point2 } = request.body;
      
      if (!point1 || !point2 || !point1.lat || !point1.lng || !point2.lat || !point2.lng) {
        return reply.status(400).send({
          error: 'Two valid points with lat/lng are required'
        });
      }
      
      const distance = await geospatialService.calculateDistance(point1, point2);
      
      reply.send({
        success: true,
        data: {
          distance_meters: distance,
          distance_km: distance / 1000,
          distance_miles: distance / 1609.34,
          point1,
          point2
        }
      });
    } catch (error) {
      console.error('Distance calculation error:', error);
      reply.status(500).send({
        error: 'Failed to calculate distance',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Update property location coordinates
  fastify.put('/properties/:propertyId/location', async (request: FastifyRequest<{
    Params: { propertyId: string };
    Body: { coordinates: Coordinates }
  }>, reply: FastifyReply) => {
    try {
      const propertyId = parseInt(request.params.propertyId);
      const { coordinates } = request.body;
      
      if (isNaN(propertyId)) {
        return reply.status(400).send({
          error: 'Valid property ID is required'
        });
      }
      
      if (!coordinates || !coordinates.lat || !coordinates.lng) {
        return reply.status(400).send({
          error: 'Valid coordinates (lat, lng) are required'
        });
      }
      
      // First, get the property's location ID
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { locationId: true }
      });
      
      if (!property) {
        return reply.status(404).send({
          error: 'Property not found'
        });
      }
      
      await geospatialService.updatePropertyLocation(property.locationId, coordinates);
      
      reply.send({
        success: true,
        message: 'Property location updated successfully',
        data: {
          property_id: propertyId,
          location_id: property.locationId,
          new_coordinates: coordinates
        }
      });
    } catch (error) {
      console.error('Update location error:', error);
      reply.status(500).send({
        error: 'Failed to update property location',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Search properties by address/location name
  fastify.get('/properties/search-by-location', async (request: FastifyRequest<{
    Querystring: {
      q: string; // search query
      radius?: string;
      limit?: string;
      offset?: string;
    }
  }>, reply: FastifyReply) => {
    try {
      const { q, radius, limit, offset } = request.query;
      
      if (!q || q.trim().length < 2) {
        return reply.status(400).send({
          error: 'Search query must be at least 2 characters'
        });
      }
      
      const radiusKm = radius ? parseFloat(radius) : 10;
      const limitNum = limit ? parseInt(limit) : 20;
      const offsetNum = offset ? parseInt(offset) : 0;
      
      // For now, do a simple text search on location fields
      // In production, integrate with a proper geocoding service
      const searchTerm = `%${q.toLowerCase()}%`;
      
      const properties = await prisma.$queryRaw`
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
        WHERE 
          LOWER(l.address) LIKE ${searchTerm} OR
          LOWER(l.city) LIKE ${searchTerm} OR
          LOWER(l.state) LIKE ${searchTerm} OR
          LOWER(p.name) LIKE ${searchTerm}
        ORDER BY p.id
        LIMIT ${limitNum}
        OFFSET ${offsetNum}
      `;
      
      reply.send({
        success: true,
        data: properties,
        meta: {
          search_query: q,
          radius_km: radiusKm,
          limit: limitNum,
          offset: offsetNum,
          count: Array.isArray(properties) ? properties.length : 0
        }
      });
    } catch (error) {
      console.error('Location search error:', error);
      reply.status(500).send({
        error: 'Failed to search properties by location',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}