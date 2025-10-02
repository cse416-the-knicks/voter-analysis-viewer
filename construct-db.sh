#!/usr/bin/bash

if [ -f /var/lib/postgresql/.lockfile ]; then
   echo "found lockfile in volume, should be okay to keep."
   exit
fi

# $File: 01-construct-db-schemas.sh
# $Author: Jerry Zhu (jerry.zhu@stonybrook.edu)
# $Date: 10-01-2025 18:10:18
# $Updated: 10-01-2025 20:17:26
# $Description: Running SQL scripts in specific order.
set -e

echo "Cred: $PGUSER:$PGHOST:$PGDATABASE:$PGPORT:$PGPASSWORD"
echo "Waiting for Postgres to be ready..."

until pg_isready -h "$PGHOST" -p "$PGPORT" -U "$PGUSER"; do
  echo "Postgres not ready yet... sleeping 2s"
  sleep 2
done

echo "============================="
echo "Creating SCHEMA..."
echo "============================="

psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "/sql-scripts/schema/001_create_states.sql"
psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "/sql-scripts/schema/002_create_eavs_geounit.sql"
psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "/sql-scripts/schema/003_create_eavs_facts.sql"
psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "/sql-scripts/schema/004_create_census_block.sql"
psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "/sql-scripts/schema/005_create_device_model.sql"
psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "/sql-scripts/schema/006_create_equipment_usage.sql"
psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "/sql-scripts/schema/007_create_voter_registration.sql"
psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "/sql-scripts/schema/008_create_election_results.sql"
psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "/sql-scripts/schema/009_create_cvap_data.sql"
psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "/sql-scripts/schema/010_alter_region_id.sql"
psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "/sql-scripts/schema/011_drop_eavs_geounit_and_migrate.sql"

echo "============================="
echo "Setting up VIEWS..."
echo "============================="

for sql in /sql-scripts/views/*.sql; do
  echo "Running $sql"
  psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "$sql"
done

echo "============================="
echo "Performing migration..."
echo "============================="

psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "/sql-scripts/schema/011_drop_eavs_geounit_and_migrate.sql"

echo "============================="
echo "Populating data..."
echo "============================="

cd /project-root/data_common/scripts/
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt 
pip install openpyxl # ???

python3 ./load_prelim_states_data.py
python3 ./load_2024_eavs_data.py

touch  /var/lib/postgresql/.lockfile
