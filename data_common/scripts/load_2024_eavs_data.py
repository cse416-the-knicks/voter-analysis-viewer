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

# Columns to pull from the spreadsheet
cols = ["FIPSCode",
        "A1a","A1b","A1c",
        "A12a","A12b","A12c","A12d","A12e","A12f","A12g","A12h","A12i","A12j","A12k",
        "C8a","C3a",
        "E1a","E2a","E2b","E2c","E2d","E2e","E2f","E2g","E2h","E2i","E2j","E2k","E2l",
        "C9b","C9c","C9d","C9e","C9f","C9g","C9h","C9i","C9j","C9k","C9l","C9m","C9n","C9o","C9p","C9q",
        "C9r","C9s","C9t"]
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

# Compute removed_other as A12i + A12j + A12k (skipping NaN)
df["removed_other"] = df[["A12i","A12j","A12k"]].sum(axis=1, skipna=True, min_count=1)

# Compute prov_other as E2j + E2k + E2l (skipping NaN)
df["prov_other"] = df[["E2j","E2k","E2l"]].sum(axis=1, skipna=True, min_count=1)

# Compute mail_reject_other as C9r + C9s + C9t (skipping NaN)
df["mail_reject_other"] = df[["C9r","C9s","C9t"]].sum(axis=1, skipna=True, min_count=1)

df["year"] = 2024

# Dropping the unused other columns before writing
df = df.drop(columns=["A12i","A12j","A12k","E2j","E2k","E2l","C9r","C9s","C9t"])

# Mapping each code to the actual schema column names
rename_map = {
    "FIPSCode": "region_id",
    "A1a": "total_registered",
    "A1b": "active_registered",
    "A1c": "inactive_registered",
    "A12a" : "total_removed",
    "A12b" : "removed_moved",
    "A12c" : "removed_deceased",
    "A12d" : "removed_felony",
    "A12e" : "removed_failed_confirm",
    "A12f" : "removed_incompetent",
    "A12g" : "removed_requested",
    "A12h" : "removed_duplicate",
    "removed_other" : "removed_other",
    "C8a" : "total_ballots_cast",
    "C3a" : "ballots_dropbox",
    "E1a": "prov_cast",
    "E2a": "prov_reason_not_in_roll",
    "E2b": "prov_reason_no_id",
    "E2c": "prov_reason_not_eligible_official",
    "E2d": "prov_reason_challenged",
    "E2e": "prov_reason_wrong_precinct",
    "E2f": "prov_reason_name_address",
    "E2g": "prov_reason_mail_ballot_unsurrendered",
    "E2h": "prov_reason_hours_extended",
    "E2i": "prov_reason_same_day_reg",
    "prov_other": "prov_other",
    "C9a" : "",
    "C9b" : "",
    "C9c" : "",
    "C9d" : "",
    "C9e" : "",
    "C9f" : "",
    "C9g" : "",
    "C9h" : "",
    "C9i" : "",
    "C9j" : "",
    "C9k" : "",
    "C9l" : "",
    "C9m" : "",
    "C9n" : "",
    "C9o" : "",
    "C9p" : "",
    "C9q" : "",
    "mail_reject_other" : "mail_reject_other"
}
df = df.rename(columns=rename_map)

print(df)

# Inserting into db
df.to_sql(
    "eavs_data",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting provisional ballot data into the database")
