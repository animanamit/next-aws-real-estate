# Real Estate Backend API

Express.js API server with PostgreSQL database for the Real Estate rental application.

## Quick Start with VS Code

### One-Click Setup 🚀

1. Open this folder in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Tasks: Run Task" and select it
4. Choose "🔄 Full Setup (Docker + Database + Server)"

This will automatically:
- Start PostgreSQL in Docker
- Set up the database schema
- Populate with mock data
- Start the development server

### Individual Tasks

You can also run individual tasks:

- **🐳 Start Docker Database** - Starts PostgreSQL container
- **📦 Setup Database & Seed Data** - Creates tables and populates data
- **🚀 Start Development Server** - Starts Express.js server
- **🛑 Stop Docker Database** - Stops PostgreSQL container
- **📊 View Database (Prisma Studio)** - Opens database GUI
- **🔍 View Docker Logs** - Shows PostgreSQL logs

## Manual Setup

### Prerequisites

- Node.js 18+
- Docker Desktop
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start PostgreSQL database
npm run docker:up

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npx prisma migrate reset --force

# Seed database with mock data
npm run seed

# Start development server
npm run dev
```

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create new property

### Applications
- `GET /api/applications` - Get applications (filtered by tenant/manager)
- `GET /api/applications/:id` - Get single application
- `POST /api/applications` - Submit new application
- `PUT /api/applications/:id/status` - Update application status

### Tenants
- `GET /api/tenants/:cognitoId` - Get tenant profile
- `POST /api/tenants` - Create new tenant
- `PUT /api/tenants/:cognitoId` - Update tenant profile
- `POST /api/tenants/:cognitoId/favorites/:propertyId` - Add favorite
- `DELETE /api/tenants/:cognitoId/favorites/:propertyId` - Remove favorite

### Managers
- `GET /api/managers/:cognitoId` - Get manager profile
- `POST /api/managers` - Create new manager
- `PUT /api/managers/:cognitoId` - Update manager profile
- `GET /api/managers/:cognitoId/properties` - Get manager's properties
- `GET /api/managers/:cognitoId/applications` - Get manager's applications

## Database

- **Database**: PostgreSQL with PostGIS extension
- **ORM**: Prisma
- **Location**: Docker container on `localhost:5432`
- **Credentials**: 
  - Username: `postgres`
  - Password: `password123`
  - Database: `real_estate_db`

## Development Commands

```bash
# Start development server with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Apply migrations
npm run prisma:reset       # Reset database
npm run prisma:studio      # Open database GUI
npm run seed               # Populate with mock data

# Docker commands
npm run docker:up          # Start PostgreSQL
npm run docker:down        # Stop PostgreSQL
npm run docker:logs        # View PostgreSQL logs
```

## Environment Variables

The `.env` file contains:

```
DATABASE_URL="postgresql://postgres:password123@localhost:5432/real_estate_db?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Testing the API

### Health Check
```bash
curl http://localhost:3001/health
```

### Get Properties
```bash
curl http://localhost:3001/api/properties
```

### Get Properties with Filters
```bash
curl "http://localhost:3001/api/properties?minPrice=1000&maxPrice=2000&beds=2"
```

## Mock Data

The database is populated with:
- 10 Properties (apartments, houses, tiny homes, etc.)
- 10 Managers
- 15 Tenants
- Sample applications and tenant favorites
- Locations across California and other states

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Express API   │────▶│   PostgreSQL    │
│   (Next.js)     │     │   (Port 3001)   │     │   (Docker)      │
│   Port 3000     │     │                 │     │   Port 5432     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

The API serves as the data layer between your Next.js frontend and the PostgreSQL database, handling all CRUD operations for properties, tenants, managers, and applications.