import pandas as pd
import numpy as np
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

# Connecting to db
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Loading 2024 EAVS data
data_path = "../raw/2024_EAVS_for_Public_Release_V1_xlsx.xlsx"
df = pd.read_excel(data_path, dtype={"FIPSCode": str})

# Columns to pull from the spreadsheet (adjust to match actual headers)
cols = ["FIPSCode","E1a","E2a","E2b","E2c","E2d","E2e","E2f","E2g","E2h","E2i","E2j","E2k","E2l"]
df = df[cols]

# Filtering out the UOCAVA Maine row
df = df[df["FIPSCode"].str.len().isin([5, 9, 10])]

# Fixing 9-digit rows (missing a leading zero)
df.loc[df["FIPSCode"].str.len() == 9, "FIPSCode"] = df["FIPSCode"].str.zfill(10)

# Fixing 5-digit rows (missing trailing zeros)
df.loc[df["FIPSCode"].str.len() == 5, "FIPSCode"] = df["FIPSCode"].str.ljust(10, "0")

# Numeric conversion
def to_int(val):
    try:
        return int(val)
    except (ValueError, TypeError):
        return np.nan

for c in cols[1:]:
    df[c] = df[c].apply(to_int)

# Compute prov_other as E2j + E2k + E2l (skip NaN)
df["prov_other"] = df[["E2j","E2k","E2l"]].sum(axis=1, skipna=True, min_count=1)

df["year"] = 2024

# Dropping the unused columns E2j, E2k, E2l before writing
df = df.drop(columns=["E2j","E2k","E2l"])

# Mapping each E2* code to the actual schema column names
rename_map = {
    "FIPSCode": "region_id",
    "E1a": "prov_cast",
    "E2a": "prov_reason_not_in_roll",
    "E2b": "prov_reason_no_id",
    "E2c": "prov_reason_not_eligibe_official",
    "E2d": "prov_reason_challenged",
    "E2e": "prov_reason_wrong_precinct",
    "E2f": "prov_reason_name_address",
    "E2g": "prov_reason_mail_ballot_unsurrendered",
    "E2h": "prov_reason_hours_extended",
    "E2i": "prov_reason_same_day_reg",
    "prov_other": "prov_other"
}
df = df.rename(columns=rename_map)

print(df)

# Inserting into db
df.to_sql(
    "eavs_data",            # Fill with name of table
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting provisional ballot data into the database")
