# Technical Test – Real Estate Platform

This repository contains a full-stack technical assessment composed of two Dockerized projects:

- `backend/PropertyService`: a .NET 8 Web API that reads real estate data from MongoDB.
- `frontend/property-web`: a Next.js (React) application that consumes the API and displays property listings with filters and detail views.

Both projects are wired together through `docker-compose.yml`, which also provisions a MongoDB instance pre-seeded with sample data.

## Project Structure

```
.
├── backend/
│   └── PropertyService/
│       ├── Application/       # Application layer contracts and services
│       ├── Controllers/       # REST controllers
│       ├── Domain/            # Domain entities
│       ├── Infrastructure/    # MongoDB integration and hosted services
│       ├── PropertyService.csproj
│       └── Dockerfile
├── backend/PropertyService.Tests/ # NUnit unit tests
├── frontend/
│   └── property-web/
│       ├── src/
│       │   ├── app/           # App Router pages
│       │   ├── components/    # UI components
│       │   └── lib/           # API helpers
│       ├── package.json
│       └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Docker Desktop or compatible CLI (required for the easiest setup).
- Alternatively, local tooling:
  - .NET 8 SDK
  - MongoDB 7+
  - Node.js 20+ with npm

## Getting Started with Docker

```bash
docker compose up --build
```

This command will:

- Start MongoDB on `localhost:27017`.
- Build and run the backend on `http://localhost:8080`.
- Build and run the frontend on `http://localhost:3000`.

The backend seeds MongoDB with three sample properties on first run. Feel free to replace the seed data or extend the repository pattern for additional CRUD operations.

To stop the stack:

```bash
docker compose down
```

## Running Projects Locally (without Docker)

### Backend API

```bash
cd backend/PropertyService
dotnet restore
dotnet run
```

Configuration is read from `appsettings.json`. Override MongoDB settings with environment variables (`MongoDb__ConnectionString`, `MongoDb__DatabaseName`, `MongoDb__CollectionName`) as needed.

### Frontend

```bash
cd frontend/property-web
npm install
npm run dev
```

Create a `.env.local` file if you need to override the API base URL:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Testing

- **Backend**: `dotnet test backend/PropertyService.Tests`
- **Frontend**: `npm test` inside `frontend/property-web` (runs Vitest with React Testing Library)

## API Overview

| Method | Endpoint                  | Description                                    | Query Params                          |
|--------|---------------------------|------------------------------------------------|---------------------------------------|
| GET    | `/api/properties`         | Returns a filtered list of properties          | `name`, `address`, `minPrice`, `maxPrice`, `page`, `pageSize` |
| GET    | `/api/properties/{id}`    | Returns details for a single property (by GUID) | –                                     |

Responses are expressed via DTOs containing: `id`, `idOwner`, `name`, `address`, `price`, and `imageUrl`.

## Frontend Highlights

- Responsive layout built with Tailwind CSS.
- Property list with client-side filters synchronized to URL query parameters.
- Detail page per property with server-side data fetching.
- Vitest and React Testing Library for component unit tests (`PropertyFilters`).

## Next Steps & Improvements

- Add mutation endpoints (create/update/delete properties).
- Extend frontend with pagination and persisted favorites.
- Secure the API with authentication/authorization.
- Add end-to-end tests (e.g., Playwright) for user flows.

---

This setup demonstrates a clean, testable architecture across .NET and React, optimized for Docker-based delivery.

