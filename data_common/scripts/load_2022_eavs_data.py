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
data_path = "../raw/2022_EAVS_for_Public_Release_V1.1.xlsx"
eavs_df = pd.read_excel(data_path, dtype={"FIPSCode": str})

# Columns to pull from the spreadsheet
cols = ["FIPSCode", "State_Abbr",
        "A1a","A1b","A1c",
        "A9a","A9b","A9c","A9d","A9e","A9f","A9g","A9h","A9i","A9j",
        "C8a","C6a",
        "F1b","F1f",
        "E1a","E2a","E2b","E2c","E2d","E2e","E2f","E2g","E2h","E2i","E2j","E2k",
        "B18a","B14a",
        "C9a","C9b","C9c","C9d","C9e","C9f","C9g","C9h","C9i","C9j","C9k","C9l","C9m","C9n","C9o","C9p","C9q",
        "C9r","C9s","C9t"]
eavs_df = eavs_df[cols]

is_wi = eavs_df["State_Abbr"] == "WI"
not_wi = ~is_wi

# Keep everything that either has a valid FIPS length OR is Wisconsin
eavs_df = eavs_df[(not_wi & eavs_df["FIPSCode"].str.len().isin([5, 9, 10])) | is_wi]

# Fix 9-digit rows
eavs_df.loc[(~is_wi) & (eavs_df["FIPSCode"].str.len() == 9), "FIPSCode"] = eavs_df["FIPSCode"].str.rjust(10, "0")

# Fix 5-digit rows
eavs_df.loc[(~is_wi) & (eavs_df["FIPSCode"].str.len() == 5), "FIPSCode"] = eavs_df["FIPSCode"].str.ljust(10, "0")

def pad_wi_code(code):
    c = str(code)
    county_part = c.zfill(5)
    return ("55" + county_part).ljust(10, "0")

# Wisconsin handled separately with custom prefix logic
eavs_df.loc[is_wi, "FIPSCode"] = eavs_df.loc[is_wi, "FIPSCode"].apply(pad_wi_code)


# Numeric conversion
def to_int(val):
    try:
        return int(val)
    except (ValueError, TypeError):
        return np.nan

for c in cols[1:]:
    eavs_df[c] = eavs_df[c].apply(to_int)

# Computing total absentee rejections
eavs_df["mail_reject_total"] = eavs_df[["C9a","B18a"]].sum(axis=1, skipna=True, min_count=1)

# Compute removed_other as A9h + A9i + A9j (skipping NaN)
eavs_df["removed_other"] = eavs_df[["A9h","A9i","A9j"]].sum(axis=1, skipna=True, min_count=1)

# Compute prov_other as E2i + E2j + E2k (skipping NaN)
eavs_df["prov_other"] = eavs_df[["E2i","E2j","E2k"]].sum(axis=1, skipna=True, min_count=1)

# Compute mail_reject_other as C9r + C9s + C9t (skipping NaN)
eavs_df["mail_reject_other"] = eavs_df[["C9r","C9s","C9t"]].sum(axis=1, skipna=True, min_count=1)

# Compute total_ballots_cast as the sum of absentee, early, eday, and provisional
eavs_df["total_ballots_cast"] = eavs_df[["C8a","B14a","F1f","F1b","E1a"]].sum(axis=1, skipna=True, min_count=1)

eavs_df["year"] = 2022

eavs_df["state_id"] = eavs_df["FIPSCode"].str[:2].astype(int)

# Dropping random american samoa row
eavs_df.drop(eavs_df[eavs_df["State_Abbr"] == "AS"].index, inplace=True)

# Dropping the unused other columns before writing
eavs_df = eavs_df.drop(columns=["A9h","A9i","A9j","E2i","E2j","E2k","C9r","C9s","C9t","State_Abbr","B18a","B14a","C9a"])

# Mapping each code to the actual schema column names
rename_map = {
    "FIPSCode": "region_id",
    "A1a": "total_registered",
    "A1b": "active_registered",
    "A1c": "inactive_registered",
    "A9a" : "total_removed",
    "A9b" : "removed_moved",
    "A9c" : "removed_deceased",
    "A9d" : "removed_felony",
    "A9e" : "removed_failed_confirm",
    "A9f" : "removed_incompetent",
    "A9g" : "removed_requested",
    "removed_other" : "removed_other",
    "C8a" : "ballots_by_mail",
    "C6a" : "ballots_dropbox",
    "total_ballots_cast" : "total_ballots_cast",
    "F1b": "ballots_in_person_eday",
    "F1f": "early_voting_total",
    "E1a": "prov_cast",
    "E2a": "prov_reason_not_in_roll",
    "E2b": "prov_reason_no_id",
    "E2c": "prov_reason_not_eligibe_official",
    "E2d": "prov_reason_challenged",
    "E2e": "prov_reason_wrong_precinct",
    "E2f": "prov_reason_name_address",
    "E2g": "prov_reason_mail_ballot_unsurrendered",
    "E2h": "prov_reason_hours_extended",
    "prov_other": "prov_other",
    "mail_reject_total" : "mail_reject_total",
    "C9b" : "mail_reject_late",
    "C9c" : "mail_reject_no_sig",
    "C9d" : "mail_reject_no_witness_sig",
    "C9e" : "mail_reject_sig_mismatch",
    "C9f" : "mail_reject_unofficial_env",
    "C9g" : "mail_reject_ballot_missing",
    "C9h" : "mail_reject_no_secrecy_env",
    "C9i" : "mail_reject_multiple_in_env",
    "C9j" : "mail_reject_unsealed_env",
    "C9k" : "mail_reject_no_postmark",
    "C9l" : "mail_reject_no_address",
    "C9m" : "mail_reject_voter_deceased",
    "C9n" : "mail_reject_duplicate_vote",
    "C9o" : "mail_reject_missing_docs",
    "C9p" : "mail_reject_not_eligible",
    "C9q" : "mail_reject_no_application",
    "mail_reject_other" : "mail_reject_other",
    "state_id" : "state_id"
}
eavs_df = eavs_df.rename(columns=rename_map)

# Removing random territories
eavs_df = eavs_df[eavs_df["state_id"] != 60]
eavs_df = eavs_df[eavs_df["state_id"] != 11]
eavs_df = eavs_df[eavs_df["state_id"] != 66]
eavs_df = eavs_df[eavs_df["state_id"] != 69]
eavs_df = eavs_df[eavs_df["state_id"] != 72]
eavs_df = eavs_df[eavs_df["state_id"] != 78]

# Fixing entry with same FIPS code (Wisconsin county aggregate)
target = "5531550000"
print(eavs_df[eavs_df["region_id"] == target])
subset = eavs_df[eavs_df["region_id"] == target]
def safe_sum(series):
    if series.isna().all():
        return np.nan
    return series.sum(skipna=True)
summed = subset.apply(safe_sum, axis=0)
summed["region_id"] = target
summed["year"] = 2022
summed["state_id"] = subset["state_id"].iloc[0]
eavs_df = pd.concat([eavs_df[eavs_df["region_id"] != target], pd.DataFrame([summed])], ignore_index=True)

print(eavs_df[eavs_df["region_id"] == target])

# Connecting to db
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
eavs_df.to_sql(
    "eavs_data",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting preliminary 2022 eavs data into the database")
