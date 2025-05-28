import { FastifyPluginAsync } from "fastify";
import { prisma } from "../index";

const tenantRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/tenants/:cognitoId - Get tenant profile
  fastify.get<{ Params: { cognitoId: string } }>("/:cognitoId", async (request, reply): Promise<void> => {
    try {
      const { cognitoId } = request.params;
      
      const tenant = await prisma.tenant.findUnique({
        where: { cognitoId },
        include: {
          properties: {
            include: {
              location: true
            }
          },
          favorites: {
            include: {
              location: true
            }
          },
          applications: {
            include: {
              property: {
                include: {
                  location: true
                }
              }
            }
          }
        }
      });

      if (!tenant) {
        return reply.status(404).send({ error: "Tenant not found" });
      }

      reply.send(tenant);
    } catch (error) {
      fastify.log.error("Error fetching tenant:", error);
      reply.status(500).send({ error: "Failed to fetch tenant" });
    }
  });

  // POST /api/tenants - Create new tenant
  fastify.post("/", async (request, reply): Promise<void> => {
    try {
      const { cognitoId, name, email, phoneNumber } = request.body as any;

      // Check if tenant already exists
      const existingTenant = await prisma.tenant.findUnique({
        where: { cognitoId }
      });

      if (existingTenant) {
        return reply.status(400).send({ error: "Tenant already exists" });
      }

      const newTenant = await prisma.tenant.create({
        data: {
          cognitoId,
          name,
          email,
          phoneNumber
        }
      });

      reply.status(201).send(newTenant);
    } catch (error) {
      fastify.log.error("Error creating tenant:", error);
      reply.status(500).send({ error: "Failed to create tenant" });
    }
  });

  // PUT /api/tenants/:cognitoId - Update tenant profile
  fastify.put<{ Params: { cognitoId: string } }>("/:cognitoId", async (request, reply): Promise<void> => {
    try {
      const { cognitoId } = request.params;
      const { name, email, phoneNumber } = request.body as any;

      const updatedTenant = await prisma.tenant.update({
        where: { cognitoId },
        data: {
          name,
          email,
          phoneNumber
        }
      });

      reply.send(updatedTenant);
    } catch (error) {
      fastify.log.error("Error updating tenant:", error);
      reply.status(500).send({ error: "Failed to update tenant" });
    }
  });

  // POST /api/tenants/:cognitoId/favorites/:propertyId - Add property to favorites
  fastify.post<{ Params: { cognitoId: string; propertyId: string } }>("/:cognitoId/favorites/:propertyId", async (request, reply): Promise<void> => {
    try {
      const { cognitoId, propertyId } = request.params;

      const updatedTenant = await prisma.tenant.update({
        where: { cognitoId },
        data: {
          favorites: {
            connect: { id: parseInt(propertyId) }
          }
        },
        include: {
          favorites: {
            include: {
              location: true
            }
          }
        }
      });

      reply.send(updatedTenant);
    } catch (error) {
      fastify.log.error("Error adding favorite:", error);
      reply.status(500).send({ error: "Failed to add favorite" });
    }
  });

  // DELETE /api/tenants/:cognitoId/favorites/:propertyId - Remove property from favorites
  fastify.delete<{ Params: { cognitoId: string; propertyId: string } }>("/:cognitoId/favorites/:propertyId", async (request, reply): Promise<void> => {
    try {
      const { cognitoId, propertyId } = request.params;

      const updatedTenant = await prisma.tenant.update({
        where: { cognitoId },
        data: {
          favorites: {
            disconnect: { id: parseInt(propertyId) }
          }
        },
        include: {
          favorites: {
            include: {
              location: true
            }
          }
        }
      });

      reply.send(updatedTenant);
    } catch (error) {
      fastify.log.error("Error removing favorite:", error);
      reply.status(500).send({ error: "Failed to remove favorite" });
    }
  });
};

export default tenantRoutes;