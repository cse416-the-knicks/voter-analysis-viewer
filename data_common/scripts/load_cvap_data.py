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

df = pd.read_csv(CVAP_PATH, usecols=cols, encoding="latin-1", dtype={
    "geoid": str,
    "cvap_est": int
})

df_filtered = df[df["geoid"].str.contains(r"^0500000US(36|40|48)")]

n = 13
records = []
for i in range(0, len(df_filtered), n):
    chunk = df_filtered.iloc[i:i+n]

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

df_final = pd.DataFrame(records)
df_final["estimate_year"] = 2023

# Connecting to db
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
df_final.to_sql(
    "cvap_data",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting 2023 CVAP data into the database")
