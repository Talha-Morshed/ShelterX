# Shelter Finder

Shelter Finder is a database-driven platform that helps homeless individuals and disaster victims locate nearby shelters, food banks, and emergency support centers.

The system stores and organizes information about relief facilities, available services, capacities, operating hours, and contact details in a centralized relational database. By providing quick access to verified information, the platform enables users to find appropriate assistance while allowing organizations to maintain accurate and up-to-date facility records.

## Contents
- `server/` — Node.js + Express backend
- `client/` — Vite + React frontend
- `mysql-data/` — optional local MySQL data directory

## Quick start (recommended: Docker for MySQL)

docker-compose up -d
1. Start MySQL, Adminer, server and client with Docker Compose (requires Docker):

```bash
# from project root
docker-compose up -d --build
```

This starts:
- MySQL on `3306`
- Adminer (DB admin UI) on `http://localhost:8080`
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:5173` (serving built static files)

2. Copy server environment variables:

```bash
cp server/.env.example server/.env
# edit server/.env if needed
```

3. Seed the database (runs SQL in `server/seeds/seed.sql`):

If you're using Docker Compose the `db` container will be available as hostname `db`.

```bash
cd server
npm install
npm run seed
npm run install:analytics
```

The analytics database objects are defined in `server/queries/view_procedure.sql`. The installer creates:
- `vw_facility_overview`, `vw_service_availability`, and `vw_public_facility_directory` views
- `sp_facilities_by_min_capacity`, `sp_facility_activity_report`, `sp_facility_capacity_status`, and `sp_facility_capacity_bands` stored procedures

The public directory view demonstrates a reusable virtual table that exposes current active facility rows while omitting internal coordinates and audit columns. The capacity status procedure demonstrates `IF`, `ELSEIF`, and `ELSE`; the capacity bands procedure demonstrates a `WHILE` loop using a temporary report table without changing permanent data.

The Admin Analytics Dashboard exposes these objects through the **Views & Procedures** category. The backend endpoints are:
- `GET /api/analytics/views/facility-overview`
- `GET /api/analytics/views/service-availability`
- `GET /api/analytics/views/public-facility-directory`
- `GET /api/analytics/procedures/facilities-by-min-capacity?minCapacity=50`
- `GET /api/analytics/procedures/facility-activity`
- `GET /api/analytics/procedures/facility-capacity-status?minCapacity=100`
- `GET /api/analytics/procedures/facility-capacity-bands`

4. Start backend and frontend together from the project root (MySQL must already be running):

```bash
npm run dev
```

Open the frontend at: http://localhost:5173

The admin PIN is verified by the backend and can be configured with `ADMIN_PIN` in `server/.env` (defaults to `1234` for local development). Successful verification issues the admin API session token used by protected dashboard requests.

## If you can't use Docker
I added a JSON fallback (`server/data/shelters.json`) so the app runs without MySQL. To use it, just start the server and client as above — data will persist to `server/data/shelters.json`.

## Files added by dev helper
- `docker-compose.yml` — MySQL + Adminer
- `server/.env.example` — sample DB env
- `server/seeds/seed.sql` — schema + sample inserts
- `server/scripts/runSeed.js` — seed runner that executes `seed.sql`

If you want, I can also add a Docker service for the `server` and `client` to run the full stack under Docker Compose.