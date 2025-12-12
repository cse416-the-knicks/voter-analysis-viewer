import os
import re
import numpy as np
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
database = os.getenv("DB_NAME")

# Helpers
def pad_wisconsin_fips(code):
    code = str(code)
    county = code.zfill(5)
    return ("55" + county).ljust(10, "0")
def safe_int(x):
    try:
        return int(x)
    except (ValueError, TypeError):
        return np.nan
def extract_jurisdiction_name(jurisdiction: str, state_id: int):
    if not isinstance(jurisdiction, str):
        return np.nan

    if state_id == 55:  # Wisconsin
        parts = jurisdiction.split(" - ")
        if len(parts) == 2:
            left, right = parts
            m = re.search(r"^(.*?)\s+COUNTY\b", right, flags=re.IGNORECASE)
            county = m.group(1).strip().title() if m else right.strip().title()
            return f"{left.strip().title()} ({county})"
        return jurisdiction.strip().title()

    m = re.search(r"^(.*?)\s+COUNTY\b", jurisdiction, flags=re.IGNORECASE)
    return m.group(1).strip().title() if m else jurisdiction.strip().title()

# Loading EAVS sheet
data_path = "../raw/2024_EAVS_for_Public_Release_V1_xlsx.xlsx"
use_columns = [
    "FIPSCode", "State_Abbr", "Jurisdiction_Name",
    "A1a","A1b","A1c",
    "A12a","A12b","A12c","A12d","A12e","A12f","A12g","A12h","A12i","A12j","A12k",
    "C8a","C3a",
    "F1b","F1f",
    "E1a", "E1d",
    "E2a","E2b","E2c","E2d","E2e","E2f","E2g","E2h","E2i","E2j","E2k","E2l",
    "B24a","B18a",
    "C9a","C9b","C9c","C9d","C9e","C9f","C9g","C9h","C9i","C9j","C9k","C9l","C9m","C9n",
    "C9o","C9p","C9q","C9r","C9s","C9t"
]
raw = pd.read_excel(
    data_path,
    dtype={"FIPSCode": str, "State_Abbr": str, "Jurisdiction_Name": str}
)
eavs_df = raw[use_columns].copy()

# Fixing FIPS codes, especially for Wisconsin
# Each Wisconsin row is by Townships, which needs to be padded differently
is_wi = eavs_df["State_Abbr"] == "WI"
not_wi = ~is_wi
valid_lengths = [5, 9, 10]
eavs_df = eavs_df[(not_wi & eavs_df["FIPSCode"].str.len().isin(valid_lengths)) | is_wi]
eavs_df.loc[(not_wi) & (eavs_df["FIPSCode"].str.len() == 9), "FIPSCode"] = (
    eavs_df["FIPSCode"].str.rjust(10, "0")
)
eavs_df.loc[(not_wi) & (eavs_df["FIPSCode"].str.len() == 5), "FIPSCode"] = (
    eavs_df["FIPSCode"].str.ljust(10, "0")
)
eavs_df.loc[is_wi, "FIPSCode"] = eavs_df.loc[is_wi, "FIPSCode"].apply(pad_wisconsin_fips)

# Numeric conversion for appropriate columns
for c in use_columns[3:]:
    eavs_df[c] = eavs_df[c].apply(safe_int)

# Derived fields for Other, Totals, and State IDs
eavs_df["mail_reject_total"] = eavs_df[["C9a", "B24a", "E1d"]].sum(axis=1, skipna=True, min_count=1)
eavs_df["removed_other"] = eavs_df[["A12i", "A12j", "A12k"]].sum(axis=1, min_count=1)
eavs_df["prov_other"] = eavs_df[["E2j", "E2k", "E2l"]].sum(axis=1, min_count=1)
eavs_df["mail_reject_other"] = eavs_df[["C9r", "C9s", "C9t"]].sum(axis=1, min_count=1)

eavs_df["total_ballots_cast"] = eavs_df[
    ["C8a", "B18a", "F1f", "F1b", "E1a"]
].sum(axis=1, min_count=1)

eavs_df["year"] = 2024
eavs_df["state_id"] = eavs_df["FIPSCode"].str[:2].astype(int)

# Removing territories and states we don't need
territories = {11, 60, 66, 69, 72, 78}
eavs_df = eavs_df[~eavs_df["state_id"].isin(territories)]
eavs_df = eavs_df[eavs_df["State_Abbr"] != "AS"]

# Renaming to database schema column names
rename_map = {
    "FIPSCode": "region_id",
    "Jurisdiction_Name": "Jurisdiction_Name",
    "A1a": "total_registered",
    "A1b": "active_registered",
    "A1c": "inactive_registered",
    "A12a": "total_removed",
    "A12b": "removed_moved",
    "A12c": "removed_deceased",
    "A12d": "removed_felony",
    "A12e": "removed_failed_confirm",
    "A12f": "removed_incompetent",
    "A12g": "removed_requested",
    "A12h": "removed_duplicate",
    "removed_other": "removed_other",
    "C8a": "ballots_by_mail",
    "C3a": "ballots_dropbox",
    "total_ballots_cast": "total_ballots_cast",
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
    "E2i": "prov_reason_same_day_reg",
    "prov_other": "prov_other",
    "mail_reject_total": "mail_reject_total",
    "C9b": "mail_reject_late",
    "C9c": "mail_reject_no_sig",
    "C9d": "mail_reject_no_witness_sig",
    "C9e": "mail_reject_sig_mismatch",
    "C9f": "mail_reject_unofficial_env",
    "C9g": "mail_reject_ballot_missing",
    "C9h": "mail_reject_no_secrecy_env",
    "C9i": "mail_reject_multiple_in_env",
    "C9j": "mail_reject_unsealed_env",
    "C9k": "mail_reject_no_postmark",
    "C9l": "mail_reject_no_address",
    "C9m": "mail_reject_voter_deceased",
    "C9n": "mail_reject_duplicate_vote",
    "C9o": "mail_reject_missing_docs",
    "C9p": "mail_reject_not_eligible",
    "C9q": "mail_reject_no_application",
    "mail_reject_other": "mail_reject_other",
    "state_id": "state_id",
}
eavs_df = eavs_df.rename(columns=rename_map)
eavs_df = eavs_df.drop(columns=[
    "A12i","A12j","A12k",
    "E2j","E2k","E2l", "E1d",
    "C9r","C9s","C9t",
    "State_Abbr","B24a","B18a","C9a"
])

# Calculating missing data score with category definitions based on GUI use-case importance
registration_cols = ["total_registered", "active_registered", "inactive_registered"]
pollbook_cols = [
    "total_removed","removed_moved","removed_deceased","removed_felony",
    "removed_failed_confirm","removed_incompetent","removed_requested",
    "removed_duplicate","removed_other"
]
provisional_cols = [
    "prov_cast","prov_reason_not_in_roll","prov_reason_no_id",
    "prov_reason_not_eligibe_official","prov_reason_challenged",
    "prov_reason_wrong_precinct","prov_reason_name_address",
    "prov_reason_mail_ballot_unsurrendered","prov_reason_hours_extended",
    "prov_reason_same_day_reg","prov_other"
]
mail_reject_cols = [
    "mail_reject_total","mail_reject_late","mail_reject_no_sig",
    "mail_reject_no_witness_sig","mail_reject_sig_mismatch",
    "mail_reject_unofficial_env","mail_reject_ballot_missing",
    "mail_reject_no_secrecy_env","mail_reject_multiple_in_env",
    "mail_reject_unsealed_env","mail_reject_no_postmark",
    "mail_reject_no_address","mail_reject_voter_deceased",
    "mail_reject_duplicate_vote","mail_reject_missing_docs",
    "mail_reject_not_eligible","mail_reject_no_application",
    "mail_reject_other"
]
voting_method_cols = [
    "ballots_by_mail","ballots_dropbox",
    "ballots_in_person_eday","early_voting_total","total_ballots_cast"
]

weights = {
    "registration": 0.30,
    "mail_rej": 0.25,
    "voting_methods": 0.25,
    "pollbook": 0.10,
    "provisional": 0.10
}

def category_score(row, cols):
    if len(cols) == 0:
        return 1
    missing = row[cols].isna().sum()
    return 1 - (missing / len(cols))

def compute_missingness(row):
    reg = category_score(row, registration_cols)
    mailr = category_score(row, mail_reject_cols)
    vm = category_score(row, voting_method_cols)
    poll = category_score(row, pollbook_cols)
    prov = category_score(row, provisional_cols)

    score = (
        reg * weights["registration"] +
        mailr * weights["mail_rej"] +
        vm * weights["voting_methods"] +
        poll * weights["pollbook"] +
        prov * weights["provisional"]
    )
    score = round(score, 2)

    return score

eavs_df["missing_data_score"] = eavs_df.apply(compute_missingness, axis=1)

# Building the geounits dataframe
geounits = pd.DataFrame({
    "state_id": eavs_df["state_id"],
    "eavs_unit_name": raw.loc[eavs_df.index, "Jurisdiction_Name"],
    "eavs_unit_code": eavs_df["region_id"],
    "name": eavs_df.apply(
        lambda row: extract_jurisdiction_name(row["Jurisdiction_Name"], row["state_id"]),
        axis=1
    )
})
eavs_df = eavs_df.drop(columns=["Jurisdiction_Name"])

# Inserting into database
engine = create_engine(f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}")
eavs_df.to_sql("eavs_data", engine, schema="app", if_exists="append", index=False)
geounits.to_sql("eavs_geounit", engine, schema="app", if_exists="append", index=False)

print("Finished inserting 2024 EAVS data into the database.")
