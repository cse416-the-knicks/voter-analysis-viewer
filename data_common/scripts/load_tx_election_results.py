import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
import re

# Loading the .env and its values
load_dotenv()
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
database = os.getenv("DB_NAME")

RESULTS_PATH = "../raw/TX-precincts-with-results.csv"

cols = [
    "GEOID",
    "votes_dem",
    "votes_rep",
    "votes_total"
]

precinct_df = pd.read_csv(
    RESULTS_PATH,
    usecols=cols,
    dtype={
        "GEOID": str,
        "votes_dem": int,
        "votes_rep": int,
        "votes_total": int
    }
)

# Removing "Precinct " from GEOID and trimming whitespace
def normalize_geoid(raw):
    cleaned = re.sub(r'(?i)precinct\s*', '', raw)
    return cleaned.strip()
precinct_df["GEOID"] = precinct_df["GEOID"].apply(normalize_geoid)

precinct_df["other_votes"] = (
    precinct_df["votes_total"] - (precinct_df["votes_rep"] + precinct_df["votes_dem"])
)

rename_map = {
    "GEOID": "region_id",
    "votes_rep": "rep_votes",
    "votes_dem": "dem_votes",
    "other_votes": "other_votes"
}
precinct_df = precinct_df[list(rename_map.keys())].rename(columns=rename_map)
precinct_df["year"] = "2024"
precinct_df["state_id"] = 48

# Creating county level results
county_df = (
    precinct_df
        .assign(
            county_fips=lambda df: df["region_id"].str.slice(0, 5),
            region_id=lambda df: df["county_fips"] + "00000"
        )
        .groupby("region_id", as_index=False)
        .agg({
            "rep_votes": "sum",
            "dem_votes": "sum",
            "other_votes": "sum"
        })
        .assign(
            year="2024",
            state_id=48
        )
)

county_rep_wins = (county_df["rep_votes"] > county_df["dem_votes"]).sum()
county_dem_wins = (county_df["dem_votes"] > county_df["rep_votes"]).sum()

print("====================Texas Election Vote Split====================")
print(f"Republican wins: {county_rep_wins}")
print(f"Democratic wins: {county_dem_wins}")
print(f"Vote split: {county_rep_wins}/{county_dem_wins}")

engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)
precinct_df.to_sql(
    "election_results",
    engine,
    schema="app",
    if_exists="append",
    index=False
)
county_df.to_sql(
    "election_results",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting 2024 Texas election results data into the database.")
