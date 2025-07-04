# JobTracker Docker Setup Guide

This guide explains how to run the JobTracker application using Docker and Docker Compose with MongoDB.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

## Quick Start

### Option 1: Development Environment (Recommended for Local Development)

Run only MongoDB with Docker, while running the app locally for hot-reload:

```bash
# Start MongoDB and Mongo Express
docker-compose -f docker-compose.dev.yml up -d

# Install dependencies and start the app locally
npm install
npm run dev
```

Your application will be available at:
- **JobTracker App**: http://localhost:5000
- **Mongo Express** (Database UI): http://localhost:8081

### Option 2: Full Production Environment

Run everything in containers:

```bash
# Build and start all services
docker-compose up --build -d
```

Your application will be available at:
- **JobTracker App**: http://localhost:5000
- **Mongo Express** (Database UI): http://localhost:8081

## Services

### MongoDB Database
- **Image**: mongo:7.0
- **Port**: 27017
- **Username**: admin
- **Password**: password
- **Database**: jobtracker

### Mongo Express (Web UI)
- **Image**: mongo-express:1.0.0
- **Port**: 8081
- **Purpose**: Web-based MongoDB admin interface (like MongoDB Compass)

### JobTracker App
- **Port**: 5000
- **Environment**: Production
- **Database Connection**: Automatically configured to connect to MongoDB

## Environment Variables

The application uses these environment variables in Docker:

```env
NODE_ENV=production
MONGODB_URL=mongodb://admin:password@mongodb:27017/jobtracker?authSource=admin
PORT=5000
```

## Database Initialization

When MongoDB starts for the first time, it automatically:
1. Creates the `jobtracker` database
2. Creates a dedicated user: `jobtracker_user`
3. Seeds sample job application data
4. Sets up the applications collection

## Docker Commands

### Start Services
```bash
# Development (MongoDB only)
docker-compose -f docker-compose.dev.yml up -d

# Production (Full stack)
docker-compose up -d
```

### Stop Services
```bash
# Development
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f mongodb
docker-compose logs -f app
```

### Rebuild Application
```bash
# Rebuild and restart the app container
docker-compose up --build app
```

### Reset Database
```bash
# Stop services and remove volumes
docker-compose down -v

# Start fresh (will re-initialize with sample data)
docker-compose up -d
```

## Accessing MongoDB

### Via Mongo Express (Web Interface)
1. Open http://localhost:8081
2. Navigate to the `jobtracker` database
3. View and manage the `applications` collection

### Via MongoDB Compass
1. Install [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Connect using: `mongodb://admin:password@localhost:27017/jobtracker?authSource=admin`

### Via Command Line
```bash
# Connect to MongoDB container
docker exec -it jobtracker-mongodb mongosh

# Use the jobtracker database
use jobtracker

# View applications
db.applications.find().pretty()
```

## Development Workflow

### For Local Development (Recommended)
1. Start MongoDB with Docker: `docker-compose -f docker-compose.dev.yml up -d`
2. Run the app locally: `npm run dev`
3. Make changes and see instant hot-reload
4. Use Mongo Express at http://localhost:8081 to view database

### For Production Testing
1. Start everything: `docker-compose up --build -d`
2. Test the production build at http://localhost:5000
3. Use logs to debug: `docker-compose logs -f app`

## Troubleshooting

### Port Already in Use
```bash
# Check what's using port 27017
lsof -i :27017

# Kill the process or change Docker ports
```

### Database Connection Issues
```bash
# Check MongoDB status
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Application Won't Start
```bash
# Check app logs
docker-compose logs app

# Rebuild the application
docker-compose up --build app
```

### Reset Everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v --remove-orphans

# Remove all Docker images
docker system prune -a

# Start fresh
docker-compose up --build -d
```

## File Structure

```
jobtracker/
├── docker-compose.yml          # Production configuration
├── docker-compose.dev.yml      # Development configuration
├── Dockerfile                  # Application container definition
├── mongo-init.js              # MongoDB initialization script
├── .dockerignore              # Docker ignore patterns
└── README-DOCKER.md           # This file
```

## Connection Strings

### From Host Machine
```
mongodb://admin:password@localhost:27017/jobtracker?authSource=admin
```

### From Within Docker Network
```
mongodb://admin:password@mongodb:27017/jobtracker?authSource=admin
```

## Security Notes

For production deployments:
1. Change default passwords in `docker-compose.yml`
2. Use environment files for sensitive data
3. Enable authentication and authorization
4. Configure firewall rules
5. Use SSL/TLS connections