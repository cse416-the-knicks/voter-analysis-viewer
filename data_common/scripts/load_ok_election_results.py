import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

# Loading the .env and its values
load_dotenv()
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
database = os.getenv("DB_NAME")

RESULTS_PATH = "../processed/pres_ok_results.csv"
GEOUNIT_PATH = "../processed/2024_eavs_geounit.csv"

ok_elec_results_df = pd.read_csv(RESULTS_PATH, dtype={
    "county": str,
    "cand_party": str,
    "cand_tot_votes": int
})
geounit = pd.read_csv(GEOUNIT_PATH, dtype=str)

# Removing every state except for Oklahoma since some counties may have same names across different states
geounit = geounit[geounit["state_id"] == "40"]

# Mapping dict for quick lookup of county name to FIPS code
county_dict = dict(zip(geounit["name"], geounit["eavs_unit_code"]))

ok_elec_results_df["county"] = ok_elec_results_df["county"].str.strip()

# Finding vote splits by every 5 rows since csv has multiple rows per county, and building new DataFrame from that
rep_wins = 0
dem_wins = 0
n = 5
records = []
for i in range(0, len(ok_elec_results_df), n):
    chunk = ok_elec_results_df.iloc[i:i+n]
    county_name = chunk["county"].iloc[0].title()
    fips_code = county_dict.get(county_name, None)
    if county_name == "Leflore":
        fips_code = "4007900000"    # Special case since county name is misspelled in results file
    if fips_code is None:
        print(f"Warning: No FIPS code found for county '{county_name}'")
        continue

    dem_votes = chunk.loc[chunk["cand_party"] == "DEM", "cand_tot_votes"].sum()
    rep_votes = chunk.loc[chunk["cand_party"] == "REP", "cand_tot_votes"].sum()
    other_votes = chunk["cand_tot_votes"].sum() - (dem_votes + rep_votes)

    if rep_votes > dem_votes:
        rep_wins += 1
    elif dem_votes > rep_votes:
        dem_wins += 1

    records.append({
        "region_id": fips_code,
        "dem_votes": dem_votes,
        "rep_votes": rep_votes,
        "other_votes": other_votes
    })

ok_results_df = pd.DataFrame(records)

ok_results_df["year"] = "2024"
ok_results_df["state_id"] = 40

print("====================Oklahoma Election Vote Split====================")
print(f"Republican wins: {rep_wins}")
print(f"Democratic wins: {dem_wins}")
print(f"Vote split: {rep_wins}/{dem_wins}")

# Connecting to db
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
ok_results_df.to_sql(
    "election_results",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting 2024 Oklahoma election results data into the database")
