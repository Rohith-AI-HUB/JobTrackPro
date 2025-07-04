# JobTracker Application

## Overview

JobTracker is a full-stack web application for managing job applications. It provides a clean, modern interface for tracking job applications with features like search, filtering, and detailed application management. The application is built with a React frontend and Express backend, using PostgreSQL for data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with TypeScript support

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon Database)
- **Validation**: Zod schemas shared between frontend and backend
- **Session Storage**: PostgreSQL-based session storage with connect-pg-simple

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/           # Utilities and configurations
│   │   └── hooks/         # Custom React hooks
├── server/                # Backend Express application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data access layer
│   └── vite.ts           # Development server integration
├── shared/                # Shared code between frontend and backend
│   └── schema.ts          # Database schema and validation
└── migrations/           # Database migration files
```

## Key Components

### Database Schema
- **Applications Table**: Stores job application data with fields for job title, company, location, application date, status, job URL, and notes
- **Users Table**: Basic user authentication (legacy, maintained for compatibility)
- **Status Types**: Enum-like constraint for application statuses (applied, interviewing, offer, rejected)

### API Endpoints
- `GET /api/applications` - List all applications with optional search and status filtering
- `GET /api/applications/:id` - Get single application details
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update existing application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/dashboard/stats` - Get dashboard statistics

### Storage Layer
- **Interface-based Design**: IStorage interface allows for different storage implementations
- **Memory Storage**: Current implementation using in-memory storage with sample data
- **Database Integration**: Configured for PostgreSQL with Drizzle ORM (ready for implementation)

### UI Components
- **Dashboard**: Main application view with statistics and application table
- **Application Table**: Sortable, searchable table with CRUD operations
- **Status Badges**: Color-coded status indicators
- **Add Application Modal**: Form for creating new applications
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS

## Data Flow

1. **Client Request**: User interacts with React components
2. **State Management**: TanStack Query manages API calls and caching
3. **API Layer**: Express routes handle HTTP requests
4. **Validation**: Zod schemas validate request data
5. **Storage Layer**: Storage interface abstracts data persistence
6. **Database**: PostgreSQL stores application data (when connected)
7. **Response**: JSON data flows back through the stack

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity for Neon
- **drizzle-orm**: TypeScript-first ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives
- **react-hook-form**: Form handling and validation
- **wouter**: Lightweight client-side routing
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the application
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Fast bundling for production builds

## Deployment Strategy

### Development Environment
- **Development Server**: Vite dev server with Express backend
- **Hot Module Replacement**: Real-time code updates during development
- **Database**: Uses memory storage with sample data for quick setup

### Production Build
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database Migration**: Drizzle Kit pushes schema changes to PostgreSQL
4. **Environment Variables**: `DATABASE_URL` required for production database connection

### Environment Configuration
- **NODE_ENV**: Controls development vs production behavior
- **DATABASE_URL**: PostgreSQL connection string (required for production)
- **Port Configuration**: Configurable via environment variables

## Changelog
- July 04, 2025. Initial setup
- July 04, 2025. MongoDB integration with Docker Compose setup added

## User Preferences

Preferred communication style: Simple, everyday language.