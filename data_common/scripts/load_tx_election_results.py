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
results_df = pd.read_csv(RESULTS_PATH, usecols=cols, dtype={
    "GEOID": str,
    "votes_dem": int,
    "votes_rep": int,
    "votes_total": int
})

# Removing "Precinct " from GEOID and trimming whitespace
def normalize_geoid(raw):
    cleaned = re.sub(r'(?i)precinct\s*', '', raw)
    cleaned = cleaned.strip()
    return cleaned
results_df["GEOID"] = results_df["GEOID"].apply(normalize_geoid)

# Calculating the Republican/Democratic vote split
rep_wins = 0
dem_wins = 0
for _, row in results_df.iterrows():
    if row["votes_rep"] > row["votes_dem"]:
        rep_wins += 1
    elif row["votes_dem"] > row["votes_rep"]:
        dem_wins += 1

results_df["other_votes"] = results_df["votes_total"] - (results_df["votes_rep"] + results_df["votes_dem"])

rename_map = {
    "GEOID": "region_id",
    "votes_rep": "rep_votes",
    "votes_dem": "dem_votes",
    "other_votes": "other_votes"
}
results_df = results_df[[c for c in rename_map if c in results_df.columns]]
results_df = results_df.rename(columns=rename_map)

results_df["year"] = "2024"
results_df["state_id"] = 48

print("====================Texas Election Vote Split====================")
print(f"Republican wins: {rep_wins}")
print(f"Democratic wins: {dem_wins}")
print(f"Vote split: {rep_wins}/{dem_wins}")

# Connecting to db
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
results_df.to_sql(
    "election_results",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting 2024 Texas election results data into the database")
