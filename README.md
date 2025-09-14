# Voter Analysis Viewer

This is capstone project repository for 'The Knicks' in CSE416 Section 1,
Fall 2025.

## Project Members

- Jerry Zhu - jerry.zhu@stonybrook.edu
- Gabriel Gil - gabrielben.gil@stonybrook.edu
- Rajvir Ghumman - rajvir.ghumman@stonybrook.edu
- Sean Moore - sean.moore@stonybrook.edu

## How To Run Backend

The backend requires Java 24.

```
cd backend_server
./gradlew bootRun
```

If you're on Windows, do the same thing but with `gradlew.bat`

## How To Run Frontend

```
cd frontend_client
npm i
npm run dev
```

The port appears to be 5173

## Database Setup

Project uses PostgreSQL 17 in Docker. setup is defined in docker-decompose.yml

From root repo run

```
docker compose down

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
