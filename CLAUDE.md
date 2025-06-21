# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
FishBase Dashboard is a Next.js-based web application that visualizes fish species data from GBIF (Global Biodiversity Information Facility) format on an interactive map. The project uses PostgreSQL (via Docker) for data storage and Prisma as the ORM.

## Commands

### Development
```bash
# Install dependencies
npm install

# Start PostgreSQL with Docker
docker-compose up -d

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Import CSV data to database
npm run import-data

# Start development server
npm run dev

# Open Prisma Studio
npx prisma studio
```

### Testing and Quality
```bash
# Run linter
npm run lint

# Run type checking
npm run type-check

# Run tests
npm run test

# Run all checks before commit
npm run pre-commit
```

### Production
```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 14+ with App Router, TypeScript
- **Styling**: Tailwind CSS
- **Map**: Leaflet with React-Leaflet
- **Database**: PostgreSQL (Docker) + Prisma ORM
- **State Management**: Zustand
- **Data Visualization**: Recharts

### Database Schema
The main `Species` model contains GBIF-formatted data including:
- Taxonomic information (kingdom, phylum, class, order, family, genus, species)
- Geographic data (latitude, longitude, country, locality)
- Temporal data (event date, year, month, day)
- Collection metadata (institution code, catalog number)

### API Structure
All API routes are in `app/api/` and follow RESTful conventions:
- Species endpoints handle CRUD operations and filtering
- Map endpoints provide optimized data for visualization
- Stats endpoints aggregate data for dashboard displays

### Key Components
- **Map Components**: Handle species location visualization with clustering
- **Filter Components**: Provide multi-faceted search capabilities
- **Species Components**: Display detailed information about specimens
- **Stats Components**: Show aggregated data and trends

## Development Guidelines

### Data Import
The CSV file (`fishbasedatabase.csv`) should be imported using the import script which:
1. Validates data integrity
2. Handles missing coordinates gracefully
3. Prevents duplicate entries based on gbifID
4. Logs import statistics

### Performance Considerations
- Use database indexing on frequently queried fields (scientificName, coordinates, year)
- Implement pagination for large datasets
- Cache map data using React Query or SWR
- Optimize images and implement lazy loading

### Map Implementation
- Start with basic markers for species locations
- Implement marker clustering for performance
- Add heatmap layer for density visualization
- Support different map providers (OpenStreetMap, Mapbox)