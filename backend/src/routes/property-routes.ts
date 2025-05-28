import { FastifyPluginAsync } from "fastify";
import { prisma } from "../index";
import { geospatialService } from "../services/geospatialService";

const propertyRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/properties - Get all properties with filters
  fastify.get("/", async (request, reply): Promise<void> => {
    try {
      const {
        minPrice,
        maxPrice,
        beds,
        baths,
        propertyType,
        city,
        state,
        amenities,
        page = "1",
        limit = "10"
      } = request.query as any;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where: any = {};

      // Price filters
      if (minPrice) where.pricePerMonth = { ...where.pricePerMonth, gte: parseFloat(minPrice) };
      if (maxPrice) where.pricePerMonth = { ...where.pricePerMonth, lte: parseFloat(maxPrice) };

      // Room filters
      if (beds) where.beds = { gte: parseInt(beds) };
      if (baths) where.baths = { gte: parseFloat(baths) };

      // Property type
      if (propertyType) where.propertyType = propertyType;

      // Location filters
      if (city || state) {
        where.location = {};
        if (city) where.location.city = { contains: city, mode: 'insensitive' };
        if (state) where.location.state = { contains: state, mode: 'insensitive' };
      }

      // Amenities filter
      if (amenities) {
        const amenityArray = Array.isArray(amenities) ? amenities : [amenities];
        where.amenities = { hasSome: amenityArray };
      }

      const [properties, total] = await Promise.all([
        prisma.property.findMany({
          where,
          include: {
            location: true,
            manager: {
              select: { id: true, name: true, email: true, phoneNumber: true }
            }
          },
          skip,
          take,
          orderBy: { postedDate: 'desc' }
        }),
        prisma.property.count({ where })
      ]);

      reply.send({
        properties,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      fastify.log.error("Error fetching properties:", error);
      reply.status(500).send({ error: "Failed to fetch properties" });
    }
  });

  // GET /api/properties/:id - Get single property
  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply): Promise<void> => {
    try {
      const { id } = request.params;
      
      const property = await prisma.property.findUnique({
        where: { id: parseInt(id) },
        include: {
          location: true,
          manager: {
            select: { id: true, name: true, email: true, phoneNumber: true }
          },
          applications: {
            select: { id: true, status: true, applicationDate: true }
          }
        }
      });

      if (!property) {
        return reply.status(404).send({ error: "Property not found" });
      }

      reply.send(property);
    } catch (error) {
      fastify.log.error("Error fetching property:", error);
      reply.status(500).send({ error: "Failed to fetch property" });
    }
  });

  // POST /api/properties - Create new property (manager only)
  fastify.post("/", async (request, reply): Promise<void> => {
    try {
      const {
        name,
        description,
        pricePerMonth,
        securityDeposit,
        applicationFee,
        photoUrls,
        amenities,
        highlights,
        isPetsAllowed,
        isParkingIncluded,
        beds,
        baths,
        squareFeet,
        propertyType,
        managerCognitoId,
        location
      } = request.body as any;

      // Geocode the address to get coordinates
      console.log(`🗺️ Geocoding address: ${location.address}, ${location.city}, ${location.state}, ${location.country}`);
      const coordinates = await geospatialService.geocodeAddress(
        location.address,
        location.city,
        location.state,
        location.country
      );

      // Create location with coordinates
      const pointWKT = geospatialService.createPoint(coordinates);
      const newLocation = await prisma.$queryRaw<any[]>`
        INSERT INTO "Location" ("address", "city", "state", "country", "postalCode", "coordinates")
        VALUES (${location.address}, ${location.city}, ${location.state}, ${location.country}, ${location.postalCode}, ST_GeomFromText(${pointWKT}, 4326))
        RETURNING id, address, city, state, country, "postalCode"
      `;

      const locationId = newLocation[0].id;

      // Create property
      const newProperty = await prisma.property.create({
        data: {
          name,
          description,
          pricePerMonth: parseFloat(pricePerMonth),
          securityDeposit: parseFloat(securityDeposit),
          applicationFee: parseFloat(applicationFee),
          photoUrls: photoUrls || [],
          amenities: amenities || [],
          highlights: highlights || [],
          isPetsAllowed: isPetsAllowed || false,
          isParkingIncluded: isParkingIncluded || false,
          beds: parseInt(beds),
          baths: parseFloat(baths),
          squareFeet: parseInt(squareFeet),
          propertyType,
          managerCognitoId,
          locationId: locationId
        },
        include: {
          location: true,
          manager: {
            select: { id: true, name: true, email: true, phoneNumber: true }
          }
        }
      });

      reply.status(201).send(newProperty);
    } catch (error) {
      fastify.log.error("Error creating property:", error);
      reply.status(500).send({ error: "Failed to create property" });
    }
  });
};

export default propertyRoutes;