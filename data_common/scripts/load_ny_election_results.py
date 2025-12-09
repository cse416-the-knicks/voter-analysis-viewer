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

RESULTS_PATH = "../raw/5591_table.csv"
GEOUNIT_PATH = "../processed/2024_eavs_geounit.csv"

ny_elec_results_df = pd.read_csv(RESULTS_PATH, dtype={
    "County": str,
    "Total Votes": int,
    "Democratic": int,
    "Republican": int
})
geounit = pd.read_csv(GEOUNIT_PATH, dtype=str)

# Removing every state except for New York since some counties may have same names across different states
geounit = geounit[geounit["state_id"] == "36"]

# Mapping dict for quick lookup of county name to FIPS code
county_dict = dict(zip(geounit["name"], geounit["eavs_unit_code"]))

ny_elec_results_df["County"] = ny_elec_results_df["County"].str.strip()

# Calculating the Republican/Democratic vote split
rep_wins = 0
dem_wins = 0
for _, row in ny_elec_results_df.iterrows():
    if row["Republican"] > row["Democratic"]:
        rep_wins += 1
    elif row["Democratic"] > row["Republican"]:
        dem_wins += 1

ny_elec_results_df["other_votes"] = ny_elec_results_df["Total Votes"] - (ny_elec_results_df["Republican"] + ny_elec_results_df["Democratic"])

rename_map = {
    "County": "region_id",
    "Republican": "rep_votes",
    "Democratic": "dem_votes",
    "other_votes": "other_votes"
}
ny_elec_results_df = ny_elec_results_df[[c for c in rename_map if c in ny_elec_results_df.columns]]
ny_elec_results_df = ny_elec_results_df.rename(columns=rename_map)

ny_elec_results_df["year"] = "2024"
ny_elec_results_df["region_id"] = ny_elec_results_df["region_id"].map(county_dict)
ny_elec_results_df["state_id"] = 36

print("====================New York Election Vote Split====================")
print(f"Republican wins: {rep_wins}")
print(f"Democratic wins: {dem_wins}")
print(f"Vote split: {rep_wins}/{dem_wins}")

# Connecting to db
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
ny_elec_results_df.to_sql(
    "election_results",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting 2024 New York election results data into the database")
