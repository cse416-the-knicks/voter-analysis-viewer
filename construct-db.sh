#!/usr/bin/bash

# $File: construct-db.sh
# $Author: Jerry Zhu (jerry.zhu@stonybrook.edu)
# $Date: 10-01-2025 18:10:18
# $Updated: 10-31-2025 10:26:00
# $Description: Running SQL scripts in specific order.

if [ -f /var/lib/postgresql/.lockfile ]; then
   echo "found lockfile in volume, should be okay to keep."
   exit
fi

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

for sql in /sql-scripts/schema/*.sql; do
  echo "Running $sql"
  psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "$sql"
done

echo "============================="
echo "Setting up VIEWS..."
echo "============================="

for sql in /sql-scripts/views/*.sql; do
  echo "Running $sql"
  psql -p "$PGPORT" -U "$PGUSER" -h "$PGHOST" -d "$PGDATABASE" -f "$sql"
done

echo "============================="
echo "Populating data..."
echo "============================="

# Special-case step for Ohio Voter State Data
# since it is massive and cannot be placed in GitHub
# due to raw file-size limit.
#
# We store split up archive parts which we need to rejoin and
# unzip afterwards.
cd /project-root/data_common/raw/ohio_voter_files/
./join.sh

cd /project-root/data_common/scripts/

# Deactivate conda only if it exists
if command -v conda &> /dev/null; then
    conda deactivate || true
fi

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt 
pip install openpyxl # ???

python3 load_prelim_states_data.py
python3 load_boundary_data.py
python3 load_2024_eavs_data.py
python3 load_2022_eavs_data.py
python3 load_2020_eavs_data.py
python3 load_2018_eavs_data.py
python3 load_2016_eavs_data.py
python3 load_ohio_voter_reg_data.py # COMMENT OUT IF NOT NEEDED, TAKES 5 OR MORE MIN TO RUN

touch  /var/lib/postgresql/.lockfile
