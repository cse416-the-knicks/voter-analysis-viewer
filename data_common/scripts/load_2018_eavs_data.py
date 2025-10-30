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
data_path = "../raw/EAVS_2018_for_Public_Release_Updates3.xlsx"
df = pd.read_excel(data_path, dtype={"FIPSCode": str})

# Columns to pull from the spreadsheet
cols = ["FIPSCode", "State_Abbr",
        "A1a","A1b","A1c",
        "A9a","A9b","A9c","A9d","A9e","A9f","A9g","A9h","A9i","A9j",
        "C3a",
        "F1b","F1f",
        "E1a","E2b","E2e","E2d","E2k","E2l","E2m",
        "B14a","B18a",
        "C4a","C4b","C4c","C4d","C4e","C4g","C4h","C4k","C4i","C4j","C4l","C4m","C4n","C4o",
        "C4p","C4q","C4r"]
df = df[cols]

is_wi = df["State_Abbr"] == "WI"
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
df["mail_reject_total"] = df[["C4a","B18a"]].sum(axis=1, skipna=True, min_count=1)

# Compute removed_other as A9h + A9i + A9j (skipping NaN)
df["removed_other"] = df[["A9h","A9i","A9j"]].sum(axis=1, skipna=True, min_count=1)

# Compute prov_other as E2k + E2l + E2m (skipping NaN)
df["prov_other"] = df[["E2k","E2l","E2m"]].sum(axis=1, skipna=True, min_count=1)

# Compute mail_reject_other as C4p + C4q + C4r (skipping NaN)
df["mail_reject_other"] = df[["C4p","C4q","C4r"]].sum(axis=1, skipna=True, min_count=1)

# Compute total_ballots_cast as the sum of absentee, early, eday, and provisional
df["total_ballots_cast"] = df[["C3a","B14a","F1f","F1b","E1a"]].sum(axis=1, skipna=True, min_count=1)

df["year"] = 2018

df["state_id"] = df["FIPSCode"].str[:2].astype(int)

# Dropping random american samoa row
df.drop(df[df["State_Abbr"] == "AS"].index, inplace=True)

# Dropping the unused other columns before writing
df = df.drop(columns=["A9h","A9i","A9j","E2k","E2l","E2m","C4p","C4q","C4r","State_Abbr","C4a","B18a","B14a"])

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
    "total_ballots_cast" : "total_ballots_cast",
    "C3a" : "ballots_by_mail",
    # Missing ballots_drop_box from 2018 codebook
    "F1b": "ballots_in_person_eday",
    "F1f": "early_voting_total",
    "E1a": "prov_cast",
    "E2b": "prov_reason_not_in_roll",
    "E2e": "prov_reason_no_id",
    "E2d": "prov_reason_wrong_precinct",
    # Missing provisional rejection reasons from 2018 codebook:
    # "E2c": "prov_reason_not_eligibe_official",
    # "E2d": "prov_reason_challenged",
    # "E2f": "prov_reason_name_address",
    # "E2g": "prov_reason_mail_ballot_unsurrendered",
    # "E2h": "prov_reason_hours_extended",
    # "E2i": "prov_reason_same_day_reg",
    "prov_other": "prov_other",
    "mail_reject_total" : "mail_reject_total",
    "C4b" : "mail_reject_late",
    "C4c" : "mail_reject_no_sig",
    "C4d" : "mail_reject_no_witness_sig",
    "C4e" : "mail_reject_sig_mismatch",
    "C4g" : "mail_reject_unofficial_env",
    "C4h" : "mail_reject_ballot_missing",
    "C4k" : "mail_reject_multiple_in_env",
    "C4i" : "mail_reject_unsealed_env",
    "C4j" : "mail_reject_no_address",
    "C4l" : "mail_reject_voter_deceased",
    "C4m" : "mail_reject_duplicate_vote",
    "C4n" : "mail_reject_missing_docs",
    "C4o" : "mail_reject_no_application",
    # Missing mail rejection reasons from 2018 codebook:
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

print("Finished inserting preliminary 2018 eavs data into the database")
