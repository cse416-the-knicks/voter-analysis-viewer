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

# Loading 2022 EAVS data
data_path = "../raw/EAVS_2016_for_Public_Release_V1.1_0.xlsx"
df = pd.read_excel(data_path, dtype={"FIPSCode": str})

# Columns to pull from the spreadsheet
cols = ["FIPSCode", "State",
        "A1a","A3a","A3b",
        "A11a", "A11b", "A11c", "A11d", "A11e", "A11f", "A11g",
        "A11h", "A11i", "A11j", "A11k",
        "B8a","B13a",
        "F1b","F1f",
        "E1a","E2a","E2d","E2c",
        "E2j","E2k","E2l","E2m","E2n","E2o","E2p",
        "C4a","C4b","C5a","C5b","C5c","C5d","C5f","C5g","C5j","C5h","C5i","C5k","C5l","C5m","C5n",
        "C5o","C5p","C5q","C5r","C5s","C5t","C5u","C5v"]
df = df[cols]

is_wi = df["State"] == "WI"
not_wi = ~is_wi

# Keep everything that either has a valid FIPS length OR is Wisconsin
df = df[(not_wi & df["FIPSCode"].str.len().isin([5, 9, 10])) | is_wi]

# Fix 9-digit rows
df.loc[(~is_wi) & (df["FIPSCode"].str.len() == 9), "FIPSCode"] = df["FIPSCode"].str.rjust(10, "0")

# Fix 5-digit rows
df.loc[(~is_wi) & (df["FIPSCode"].str.len() == 5), "FIPSCode"] = df["FIPSCode"].str.ljust(10, "0")

def pad_wi_code(code):
    c = str(code)
    county_part = c.zfill(5)
    return ("55" + county_part).ljust(10, "0")

# Wisconsin handled separately with custom prefix logic
df.loc[is_wi, "FIPSCode"] = df.loc[is_wi, "FIPSCode"].apply(pad_wi_code)

# Numeric conversion
def to_int(val):
    try:
        return int(val)
    except (ValueError, TypeError):
        return np.nan

for c in cols[1:]:
    df[c] = df[c].apply(to_int)

# Computing total absentee rejections
df["mail_reject_total"] = df[["C4b","B13a"]].sum(axis=1, skipna=True, min_count=1)

# Compute removed_other as A11h + A11i + A11j + A11k (skipping NaN)
df["removed_other"] = df[["A11h","A11i","A11j","A11k"]].sum(axis=1, skipna=True, min_count=1)

# Compute prov_other as E2j + E2k + E2l + E2m + E2n + E2o + E2p (skipping NaN)
df["prov_other"] = df[["E2j","E2k","E2l","E2m","E2n","E2o","E2p"]].sum(axis=1, skipna=True, min_count=1)

# Compute mail_reject_other as C5o + C5p + C5q + C5r + C5s + C5t + C5u + C5v (skipping NaN)
df["mail_reject_other"] = df[["C5o","C5p","C5q","C5r","C5s","C5t","C5u","C5v"]].sum(axis=1, skipna=True, min_count=1)

# Compute total_ballots_cast as the sum of absentee, early, eday, and provisional
df["total_ballots_cast"] = df[["C4a","B8a","F1f","F1b","E1a"]].sum(axis=1, skipna=True, min_count=1)

df["year"] = 2016

df["state_id"] = df["FIPSCode"].str[:2].astype(int)

# Dropping random american samoa row
df.drop(df[df["State"] == "AS"].index, inplace=True)

# Dropping the unused other columns before writing
df = df.drop(columns=["A11h","A11i","A11j","A11k","E2j","E2k","E2l","E2m","E2n","E2o","E2p","C5o","C5p","C5q","C5r","C5s","C5t","C5u","C5v","State","B13a","C4b","B8a"])

# Mapping each code to the actual schema column names
rename_map = {
    "FIPSCode": "region_id",
    "A1a": "total_registered",
    "A3a": "active_registered",
    "A3b": "inactive_registered",
    "A11a" : "total_removed",
    "A11b" : "removed_moved",
    "A11c" : "removed_deceased",
    "A11d" : "removed_felony",
    "A11e" : "removed_failed_confirm",
    "A11f" : "removed_incompetent",
    "A11g" : "removed_requested",
    "removed_other" : "removed_other",
    "total_ballots_cast" : "total_ballots_cast",
    "C4a" : "ballots_by_mail",
    # Missing ballots_drop_box from 2016 codebook
    "F1b": "ballots_in_person_eday",
    "F1f": "early_voting_total",
    "E1a": "prov_cast",
    "E2a": "prov_reason_not_in_roll",
    "E2d": "prov_reason_no_id",
    "E2c": "prov_reason_wrong_precinct",
    # Missing provisional rejection reasons from 2016 codebook:
    # "E2c": "prov_reason_not_eligibe_official",
    # "E2d": "prov_reason_challenged",
    # "E2f": "prov_reason_name_address",
    # "E2g": "prov_reason_mail_ballot_unsurrendered",
    # "E2h": "prov_reason_hours_extended",
    # "E2i": "prov_reason_same_day_reg",
    "prov_other": "prov_other",
    "mail_reject_total" : "mail_reject_total",
    "C5a" : "mail_reject_late",
    "C5b" : "mail_reject_no_sig",
    "C5c" : "mail_reject_no_witness_sig",
    "C5d" : "mail_reject_sig_mismatch",
    "C5f" : "mail_reject_unofficial_env",
    "C5g" : "mail_reject_ballot_missing",
    "C5j" : "mail_reject_multiple_in_env",
    "C5h" : "mail_reject_unsealed_env",
    "C5i" : "mail_reject_no_address",
    "C5k" : "mail_reject_voter_deceased",
    "C5l" : "mail_reject_duplicate_vote",
    "C5m" : "mail_reject_missing_docs",
    "C5n" : "mail_reject_no_application",
    # Missing mail rejection reasons from 2016 codebook:
    # "C9h" : "mail_reject_no_secrecy_env",
    # "C9k" : "mail_reject_no_postmark",
    # "C9p" : "mail_reject_not_eligible",
    "mail_reject_other" : "mail_reject_other",
    "state_id" : "state_id"
}
df = df.rename(columns=rename_map)

# Removing random territories
df = df[df["state_id"] != 60]
df = df[df["state_id"] != 11]
df = df[df["state_id"] != 66]
df = df[df["state_id"] != 69]
df = df[df["state_id"] != 72]
df = df[df["state_id"] != 78]

# Fixing entries with same FIPS code (Wisconsin county aggregate)
dupes = df["region_id"][df["region_id"].duplicated()].unique()
for target in dupes:
    print(df[df["region_id"] == target])
    subset = df[df["region_id"] == target]
    def safe_sum(series):
        if series.isna().all():
            return np.nan
        return series.sum(skipna=True)
    summed = subset.apply(safe_sum, axis=0)
    summed["region_id"] = target
    summed["year"] = subset["year"].iloc[0]
    summed["state_id"] = subset["state_id"].iloc[0]
    df = pd.concat([df[df["region_id"] != target], pd.DataFrame([summed])], ignore_index=True)

print(df)

# Connecting to db
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
df.to_sql(
    "eavs_data",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting preliminary 2016 eavs data into the database")
