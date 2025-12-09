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

CVAP_PATH = "../raw/County.csv"

cols = [
    "geoid",
    "cvap_est"
]

raw_cvap_df = pd.read_csv(CVAP_PATH, usecols=cols, encoding="latin-1", dtype={
    "geoid": str,
    "cvap_est": int
})

cvap_df = raw_cvap_df[raw_cvap_df["geoid"].str.contains(r"^0500000US(36|40|48)")]

# Load Texas precinct region IDs (produced by election script)
tx_precinct_list = pd.read_csv("../processed/tx_precinct_region_ids.csv", dtype=str)
tx_precinct_counts = (
    tx_precinct_list.groupby("county_fips").size().reset_index(name="precinct_count")
)

n = 13
records = []
for i in range(0, len(cvap_df), n):
    chunk = cvap_df.iloc[i:i+n]

    geoid = chunk["geoid"].iloc[0]
    state_id = geoid[9:11]
    county_fips = geoid[11:14]
    fips_code = f"{state_id}{county_fips}00000"

    cvap_total = chunk["cvap_est"].iloc[0]
    cvap_white = chunk["cvap_est"].iloc[6]
    cvap_black = chunk["cvap_est"].iloc[4]
    cvap_hispanic = chunk["cvap_est"].iloc[12]
    cvap_asian = chunk["cvap_est"].iloc[3]
    cvap_other = cvap_total - (cvap_white + cvap_black + cvap_hispanic + cvap_asian)

    records.append({
        "region_id": fips_code,
        "state_id": int(state_id),
        "cvap_total": cvap_total,
        "cvap_white": cvap_white,
        "cvap_black": cvap_black,
        "cvap_hispanic": cvap_hispanic,
        "cvap_asian": cvap_asian,
        "cvap_other": cvap_other
    })

    # Adding Texas precinct-level CVAP values
    if state_id == "48":
        county_key = f"48{county_fips}"

        precinct_count = tx_precinct_counts.loc[
            tx_precinct_counts["county_fips"] == county_key, "precinct_count"
        ].iloc[0]

        county_precincts = tx_precinct_list[
            tx_precinct_list["county_fips"] == county_key
        ]["GEOID"]

        cvap_total_p = cvap_total / precinct_count
        cvap_white_p = cvap_white / precinct_count
        cvap_black_p = cvap_black / precinct_count
        cvap_hispanic_p = cvap_hispanic / precinct_count
        cvap_asian_p = cvap_asian / precinct_count
        cvap_other_p = cvap_other / precinct_count

        for r in county_precincts:
            records.append({
                "region_id": r,
                "state_id": 48,
                "cvap_total": cvap_total_p,
                "cvap_white": cvap_white_p,
                "cvap_black": cvap_black_p,
                "cvap_hispanic": cvap_hispanic_p,
                "cvap_asian": cvap_asian_p,
                "cvap_other": cvap_other_p
            })

agg_cvap_df = pd.DataFrame(records)
agg_cvap_df["estimate_year"] = 2023

# Connecting to db
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
agg_cvap_df.to_sql(
    "cvap_data",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting 2023 CVAP data into the database")
