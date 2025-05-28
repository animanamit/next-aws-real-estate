import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Import routes
import propertyRoutes from "./routes/property-routes";
import tenantRoutes from "./routes/tenant-routes";
import managerRoutes from "./routes/manager-routes";
import applicationRoutes from "./routes/application-routes";
import { uploadRoutes } from "./routes/uploadRoutes";
import { geospatialRoutes } from "./routes/geospatialRoutes";

dotenv.config();

const fastify = Fastify({
  logger: true
});

const PORT = parseInt(process.env['PORT'] || '3001');

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Register plugins
async function setupServer() {
  // Security
  await fastify.register(helmet);
  
  // CORS
  await fastify.register(cors, {
    origin: process.env['FRONTEND_URL'] || "http://localhost:3000",
    credentials: true,
  });

  // Health check endpoint
  fastify.get("/health", async (request, reply) => {
    return { 
      status: "OK", 
      message: "Real Estate API is running",
      timestamp: new Date().toISOString()
    };
  });

  // Register API routes
  await fastify.register(propertyRoutes, { prefix: "/api/properties" });
  await fastify.register(tenantRoutes, { prefix: "/api/tenants" });
  await fastify.register(managerRoutes, { prefix: "/api/managers" });
  await fastify.register(applicationRoutes, { prefix: "/api/applications" });
  await fastify.register(uploadRoutes, { prefix: "/api" });
  await fastify.register(geospatialRoutes, { prefix: "/api/geo" });

  // 404 handler
  fastify.setNotFoundHandler(async (request, reply) => {
    reply.status(404).send({ error: "Route not found" });
  });

  // Error handler
  fastify.setErrorHandler(async (error, request, reply) => {
    fastify.log.error(error);
    reply.status(error.statusCode || 500).send({
      error: error.message || "Internal server error",
      ...(process.env['NODE_ENV'] === "development" && { stack: error.stack })
    });
  });

  return fastify;
}

// Start server
async function start() {
  try {
    const server = await setupServer();
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🏠 API endpoints: http://localhost:${PORT}/api`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await prisma.$disconnect();
  await fastify.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down server...");
  await prisma.$disconnect();
  await fastify.close();
  process.exit(0);
});

start();