# Voter Analysis Viewer

This is capstone project repository for 'The Knicks' in CSE416 Section 1,
Fall 2025.

## Project Members

- Jerry Zhu - jerry.zhu@stonybrook.edu
- Gabriel Gil - gabrielben.gil@stonybrook.edu
- Rajvir Ghumman - rajvir.ghumman@stonybrook.edu
- Sean Moore - sean.moore@stonybrook.edu

## Next Steps
As of the final presentation the following are items that should be done, but we did not have sufficient time to improve upon by the end of the semester:

- Optimize our Gingles Chart for Texas by one of the following
 - Render it once into an image
 - Use the GPU to do it with WebGL
 - Use Canvas

- Update our relevant documents including our class diagram and DB Schema

## Voting Machine Google Sheets
We source our voting machine data from the class-wide Voting Machine Spreadsheet,
and we fetch it through a script in `/data_common/scripts/`, it's called `download_latest_voting_machine_sheet.py`,

It depends on [Playwright](https://playwright.dev/), so please `pip install -r requirements.txt`, before
running the script.

The script will request for you to do a singular login through your SBU-email so you can get access to the
spreadsheet, and then subsequent runs will automatically download the spreadsheet.

## Environment Details 
- There should be 1 .env file in the either the `data_common` directory or the `data_common/scripts` directory. This file is executed within docker. It should be formatted like the following:

DB_USER=Leffison Members
DB_PASSWORD=raj
DB_HOST=db
DB_PORT=5432
DB_NAME=leffison_db

- There should be 1 .env file in either the `backend_server/bin/main` directory or the `backend_server/src/main/resources` directory. It should be formatted like the following:

spring.datasource.url=jdbc:postgresql://localhost:5433/leffison_db
spring.datasource.username=Leffison Members
spring.datasource.password=raj

## OpenAPI Code Generation
Since our project utilizes the OpenAPI standard to reduce the amount of boilerplate code
we need to run.

You will need to run this task on the backend_server folder:
```
./gradlew generateOpenApiDoc
```

You will also need to run this on the frontend:
```
npm run apigen
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

This will setup the Postgres container image, and also setup an image to
setup the Postgres database and seed it with our data.

If there are changes to the base data, you'll need to wipe and reinitialize,
but this should be fine since the docker scripts make it easily reproducible,
it just might take a bit of time.

```
Connection Details
Host: Sean's TailscaleIP (private)
Port: 5433
Database: leffison_db
User: "Leffison Members"
Password: raj
Default schema: app
```

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
