# Real Estate Platform: A Senior-Level Full-Stack Learning Project

A comprehensive real estate rental platform built to demonstrate enterprise-grade architecture patterns, modern full-stack development practices, and senior-level engineering thinking. This project serves as both a functional application and a learning resource for developers transitioning from intermediate to senior-level skills.

## 🏗️ Project Overview

This project represents the evolution of a real estate platform from a traditional Next.js monolithic approach to a modern, separated architecture that prioritizes scalability, maintainability, and developer experience. The implementation demonstrates sophisticated patterns in React, TypeScript, Node.js, and cloud integration while serving as a comprehensive learning resource.

### Key Features

- **🔍 Advanced Property Search** - Geospatial search with PostGIS, filtering, and pagination
- **🗺️ Location-Based Discovery** - Interactive maps and proximity-based property finding
- **👥 Multi-Role Authentication** - Tenant/Manager roles with AWS Cognito integration
- **📸 File Management** - AWS S3 integration with image optimization and processing
- **📊 Dashboard Analytics** - Role-specific dashboards with comprehensive metrics
- **🎭 Demo Mode** - Seamless role switching for demonstrations and testing
- **⚡ Real-Time Features** - Optimistic updates and background synchronization
- **🔒 Enterprise Security** - Role-based access control and comprehensive input validation

## 🎯 Learning Objectives

This project was designed specifically to accelerate the transition from intermediate frontend development to senior full-stack engineering by demonstrating:

- **Architectural Decision-Making** - Understanding trade-offs in technology and design choices
- **System Design Thinking** - Approaching problems holistically with scalability in mind
- **Advanced React Patterns** - Server components, advanced state management, and optimization
- **Backend Architecture** - RESTful API design, database optimization, and cloud integration
- **Production Readiness** - Security, performance, monitoring, and deployment considerations

## 🏛️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router and Server Components
- **State Management**: Redux Toolkit + RTK Query for optimal state boundaries
- **Styling**: Tailwind CSS with Shadcn/ui component library
- **Authentication**: AWS Cognito integration with role-based routing
- **Type Safety**: Comprehensive TypeScript with strict configuration

### Backend (Fastify)
- **Framework**: Fastify API server for high performance and TypeScript support
- **Database**: PostgreSQL with PostGIS for geospatial capabilities
- **ORM**: Prisma with type-safe queries and migrations
- **File Storage**: AWS S3 with image optimization using Sharp
- **Authentication**: JWT validation with role-based middleware

### Infrastructure
- **Database**: PostgreSQL with PostGIS extensions (AWS RDS)
- **File Storage**: AWS S3 with CDN capabilities
- **Authentication**: AWS Cognito for user management
- **Deployment**: Containerized deployment with PM2 process management

## 📚 Project Structure

```
next-aws-real-estate/
├── frontend/                 # Next.js client application
│   ├── src/
│   │   ├── app/             # App Router pages and layouts
│   │   ├── components/      # React components organized by domain
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and constants
│   │   ├── state/           # Redux store and RTK Query
│   │   └── types/           # TypeScript definitions
│   └── [config files]      # Next.js, Tailwind, TypeScript configs
├── backend/                 # Fastify API server
│   ├── src/
│   │   ├── controllers/     # Business logic handlers
│   │   ├── middleware/      # Authentication and CORS
│   │   ├── routes/          # API endpoint definitions
│   │   └── services/        # External service integrations
│   ├── prisma/              # Database schema and migrations
│   └── [config files]      # Server configuration
├── CLAUDE.md               # Development guidelines and learning context
├── future-projects.md      # Comprehensive learning guide and methodology
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ with PostGIS extension
- AWS account (for S3 and Cognito services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-aws-real-estate
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your database and AWS credentials
   
   # Set up database
   npx prisma migrate dev
   npx prisma db seed
   
   # Start the development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Configure environment variables
   cp .env.local.example .env.local
   # Edit .env.local with your API and AWS endpoints
   
   # Start the development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Environment Configuration

**Backend (.env)**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/realestate"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
JWT_SECRET="your-jwt-secret"
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:3001"
NEXT_PUBLIC_AWS_REGION="us-east-1"
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID="your-user-pool-id"
NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID="your-client-id"
```

## 🎨 Key Features Deep Dive

### Advanced Search & Geospatial Capabilities
- **PostGIS Integration**: Complex spatial queries for proximity-based search
- **Dynamic Filtering**: Real-time filtering with URL state synchronization
- **Pagination**: Sophisticated pagination with location-aware results
- **Performance Optimization**: Spatial indexing and query optimization

### State Management Architecture
- **RTK Query**: Advanced caching with tag-based invalidation
- **Redux Toolkit**: UI state management with proper boundaries
- **Optimistic Updates**: Immediate UI feedback with background sync
- **Form Management**: React Hook Form with Zod validation

### Authentication & Authorization
- **AWS Cognito**: Enterprise-grade user management
- **Role-Based Access**: Granular permissions for tenants and managers
- **Demo Mode**: Seamless role switching for demonstrations
- **Security**: JWT validation and route protection

### File Management & Cloud Integration
- **AWS S3**: Scalable file storage with CDN capabilities
- **Image Processing**: Automatic optimization using Sharp
- **Upload Interface**: Drag-and-drop with progress tracking

### Key Learning Topics Covered

1. **Architectural Decision Making** - Understanding trade-offs in system design
2. **Modern React Patterns** - Server components, advanced hooks, and optimization
3. **State Management Mastery** - Proper boundaries and advanced patterns
4. **API Design Excellence** - RESTful principles and performance optimization
5. **Database Architecture** - Relational design with geospatial capabilities
6. **Cloud Integration** - AWS services and production deployment
7. **Security Implementation** - Authentication, authorization, and data protection
8. **Performance Optimization** - Frontend and backend performance strategies

## 🔧 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

## 🧪 Testing

The project includes comprehensive testing strategies:

- **Unit Tests**: Critical business logic and utility functions
- **Integration Tests**: API endpoints and database operations
- **Component Tests**: React component behavior and interactions
- **E2E Tests**: Complete user workflows and scenarios

```bash
# Frontend testing
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests

# Backend testing
npm run test         # Run API integration tests
npm run test:db      # Database operation tests
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Inspiration**: Ed Roh's "real-estate-prod" project for architectural insights

---
