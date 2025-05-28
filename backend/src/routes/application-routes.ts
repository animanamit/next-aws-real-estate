import { FastifyPluginAsync } from "fastify";
import { prisma } from "../index";

const applicationRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/applications - Get applications (filtered by tenant or manager)
  fastify.get("/", async (request, reply): Promise<void> => {
    try {
      const { tenantCognitoId, managerCognitoId, status } = request.query as any;

      const where: any = {};

      if (tenantCognitoId) {
        where.tenantCognitoId = tenantCognitoId;
      }

      if (managerCognitoId) {
        where.property = {
          managerCognitoId: managerCognitoId
        };
      }

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
      fastify.log.error("Error fetching applications:", error);
      reply.status(500).send({ error: "Failed to fetch applications" });
    }
  });

  // GET /api/applications/:id - Get single application
  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply): Promise<void> => {
    try {
      const { id } = request.params;
      
      const application = await prisma.application.findUnique({
        where: { id: parseInt(id) },
        include: {
          property: {
            include: {
              location: true,
              manager: {
                select: { id: true, name: true, email: true, phoneNumber: true }
              }
            }
          },
          tenant: {
            select: { id: true, name: true, email: true, phoneNumber: true }
          }
        }
      });

      if (!application) {
        return reply.status(404).send({ error: "Application not found" });
      }

      reply.send(application);
    } catch (error) {
      fastify.log.error("Error fetching application:", error);
      reply.status(500).send({ error: "Failed to fetch application" });
    }
  });

  // POST /api/applications - Submit new application
  fastify.post("/", async (request, reply): Promise<void> => {
    try {
      const {
        propertyId,
        tenantCognitoId,
        name,
        email,
        phoneNumber,
        message
      } = request.body as any;

      // Check if property exists
      const property = await prisma.property.findUnique({
        where: { id: parseInt(propertyId) }
      });

      if (!property) {
        return reply.status(404).send({ error: "Property not found" });
      }

      // Check if tenant exists
      const tenant = await prisma.tenant.findUnique({
        where: { cognitoId: tenantCognitoId }
      });

      if (!tenant) {
        return reply.status(404).send({ error: "Tenant not found" });
      }

      // Check if application already exists
      const existingApplication = await prisma.application.findFirst({
        where: {
          propertyId: parseInt(propertyId),
          tenantCognitoId: tenantCognitoId
        }
      });

      if (existingApplication) {
        return reply.status(400).send({ error: "Application already submitted for this property" });
      }

      const newApplication = await prisma.application.create({
        data: {
          propertyId: parseInt(propertyId),
          tenantCognitoId,
          name,
          email,
          phoneNumber,
          message: message || null,
          applicationDate: new Date(),
          status: "Pending"
        },
        include: {
          property: {
            include: {
              location: true
            }
          },
          tenant: {
            select: { id: true, name: true, email: true, phoneNumber: true }
          }
        }
      });

      reply.status(201).send(newApplication);
    } catch (error) {
      fastify.log.error("Error creating application:", error);
      reply.status(500).send({ error: "Failed to create application" });
    }
  });

  // PUT /api/applications/:id/status - Update application status (manager only)
  fastify.put<{ Params: { id: string } }>("/status/:id", async (request, reply): Promise<void> => {
    try {
      const { id } = request.params;
      const { status } = request.body as any;

      if (!["Pending", "Approved", "Denied"].includes(status)) {
        return reply.status(400).send({ error: "Invalid status" });
      }

      const updatedApplication = await prisma.application.update({
        where: { id: parseInt(id) },
        data: { status },
        include: {
          property: {
            include: {
              location: true
            }
          },
          tenant: {
            select: { id: true, name: true, email: true, phoneNumber: true }
          }
        }
      });

      reply.send(updatedApplication);
    } catch (error) {
      fastify.log.error("Error updating application status:", error);
      reply.status(500).send({ error: "Failed to update application status" });
    }
  });
};

export default applicationRoutes;