# Voter Analysis Viewer

This is capstone project repository for 'The Knicks' in CSE416 Section 1,
Fall 2025.

## Project Members

- Jerry Zhu - jerry.zhu@stonybrook.edu
- Gabriel Gil - gabrielben.gil@stonybrook.edu
- Rajvir Ghumman - rajvir.ghumman@stonybrook.edu
- Sean Moore - sean.moore@stonybrook.edu

## OpenAPI Code Generation
Since our project utilizes the OpenAPI standard to reduce the amount of boilerplate code
we need to run.

You will need to run this task on the backend_server folder:
```
./gradlew generateOpenApiDoc
```

You will also need to run this on the frontend:
```
npm run genapi
```

This should keep everything up to date.

## How To Run Backend

The backend requires Java 24.

```
cd backend_server
./gradlew bootRun
```

If you're on Windows, do the same thing but with `gradlew.bat`

Also make sure you setup an .env file.

## How To Run Frontend

```
cd frontend_client
npm i
npm run dev
```

The port appears to be 5173

## Database Setup

Project uses PostgreSQL 17 in Docker. setup is defined in docker-compose.yml

From root repo run

```
docker compose up -d
```

Connection Details

Host: Sean's TailscaleIP (private)

Port: 5433

Database: leffison_db

User: "Leffison Members"

Password: raj

Default schema: app

Useful commands:
To stop the Database:
```
docker compose down
```
Restart the database:
```
docker compose up -d
```
Reset completely (wipe data & re-run init-sql):
```
docker compose down -v
docker compose up -d
```
