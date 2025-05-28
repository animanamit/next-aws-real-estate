import { FastifyPluginAsync } from "fastify";
import { prisma } from "../index";

const managerRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/managers/:cognitoId - Get manager profile
  fastify.get<{ Params: { cognitoId: string } }>("/:cognitoId", async (request, reply): Promise<void> => {
    try {
      const { cognitoId } = request.params;
      
      const manager = await prisma.manager.findUnique({
        where: { cognitoId },
        include: {
          managedProperties: {
            include: {
              location: true,
              applications: {
                include: {
                  tenant: {
                    select: { id: true, name: true, email: true, phoneNumber: true }
                  }
                }
              }
            }
          }
        }
      });

      if (!manager) {
        return reply.status(404).send({ error: "Manager not found" });
      }

      reply.send(manager);
    } catch (error) {
      fastify.log.error("Error fetching manager:", error);
      reply.status(500).send({ error: "Failed to fetch manager" });
    }
  });

  // POST /api/managers - Create new manager
  fastify.post("/", async (request, reply): Promise<void> => {
    try {
      const { cognitoId, name, email, phoneNumber } = request.body as any;

      // Check if manager already exists
      const existingManager = await prisma.manager.findUnique({
        where: { cognitoId }
      });

      if (existingManager) {
        return reply.status(400).send({ error: "Manager already exists" });
      }

      const newManager = await prisma.manager.create({
        data: {
          cognitoId,
          name,
          email,
          phoneNumber
        }
      });

      reply.status(201).send(newManager);
    } catch (error) {
      fastify.log.error("Error creating manager:", error);
      reply.status(500).send({ error: "Failed to create manager" });
    }
  });

  // PUT /api/managers/:cognitoId - Update manager profile
  fastify.put<{ Params: { cognitoId: string } }>("/:cognitoId", async (request, reply): Promise<void> => {
    try {
      const { cognitoId } = request.params;
      const { name, email, phoneNumber } = request.body as any;

      const updatedManager = await prisma.manager.update({
        where: { cognitoId },
        data: {
          name,
          email,
          phoneNumber
        }
      });

      reply.send(updatedManager);
    } catch (error) {
      fastify.log.error("Error updating manager:", error);
      reply.status(500).send({ error: "Failed to update manager" });
    }
  });

  // GET /api/managers/:cognitoId/properties - Get manager's properties
  fastify.get<{ Params: { cognitoId: string } }>("/:cognitoId/properties", async (request, reply): Promise<void> => {
    try {
      const { cognitoId } = request.params;

      const properties = await prisma.property.findMany({
        where: { managerCognitoId: cognitoId },
        include: {
          location: true,
          applications: {
            include: {
              tenant: {
                select: { id: true, name: true, email: true, phoneNumber: true }
              }
            }
          }
        },
        orderBy: { postedDate: 'desc' }
      });

      reply.send(properties);
    } catch (error) {
      fastify.log.error("Error fetching manager properties:", error);
      reply.status(500).send({ error: "Failed to fetch manager properties" });
    }
  });

  // GET /api/managers/:cognitoId/applications - Get all applications for manager's properties
  fastify.get<{ Params: { cognitoId: string } }>("/:cognitoId/applications", async (request, reply): Promise<void> => {
    try {
      const { cognitoId } = request.params;
      const { status } = request.query as any;

      const where: any = {
        property: {
          managerCognitoId: cognitoId
        }
      };

      if (status) {
        where.status = status;
      }

      const applications = await prisma.application.findMany({
        where,
        include: {
          property: {
            include: {
              location: true
            }
          },
          tenant: {
            select: { id: true, name: true, email: true, phoneNumber: true }
          }
        },
        orderBy: { applicationDate: 'desc' }
      });

      reply.send(applications);
    } catch (error) {
      fastify.log.error("Error fetching manager applications:", error);
      reply.status(500).send({ error: "Failed to fetch manager applications" });
    }
  });
};

export default managerRoutes;