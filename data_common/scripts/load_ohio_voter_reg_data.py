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

OHIO_FIPS_CODE = "39"

# Loading Ohio Voter Registration data
files = ["SWVF_1_22.csv", "SWVF_23_44.csv", "SWVF_45_66.csv", "SWVF_67_88.csv"]
cols = [
    "COUNTY_NUMBER",
    "LAST_NAME",
    "FIRST_NAME",
    "MIDDLE_NAME",
    "REGISTRATION_DATE",
    "VOTER_STATUS",
    "PARTY_AFFILIATION",
    "RESIDENTIAL_ADDRESS1",
    "RESIDENTIAL_CITY",
    "RESIDENTIAL_ZIP",
]

total_voters = 0
republican_voters = 0
democratic_voters = 0
unaffiliated_voters = 0

for file in files:
    print(f"=========Processing file: {file}=========")
    data_path = f"../raw/ohio_voter_files/{file}"
    ohio_voter_df = pd.read_csv(data_path, usecols=cols, encoding="cp1252", dtype={
        "COUNTY_NUMBER": str,
        "LAST_NAME": str,
        "FIRST_NAME": str,
        "MIDDLE_NAME": str,
        "REGISTRATION_DATE": str,
        "VOTER_STATUS": str,
        "PARTY_AFFILIATION": str,
        "RESIDENTIAL_ADDRESS_1": str,
        "RESIDENTIAL_CITY": str,
        "RESIDENTIAL_ZIPCODE": str,
    })

    ohio_voter_df["region_id"] = (OHIO_FIPS_CODE + (((ohio_voter_df["COUNTY_NUMBER"].astype(int) - 1) * 2 + 1).astype(str).str.zfill(3))).str.ljust(10, "0")

    ohio_voter_df = ohio_voter_df.drop(columns=["COUNTY_NUMBER"])

    # Normalize PARTY_AFFILIATION to uppercase and replace NaN with empty string
    ohio_voter_df["PARTY_AFFILIATION"] = ohio_voter_df["PARTY_AFFILIATION"].fillna("").str.upper().str.strip()

    total_voters += len(ohio_voter_df)

    republican_voters += (ohio_voter_df["PARTY_AFFILIATION"].str.upper() == "R").sum()
    democratic_voters += (ohio_voter_df["PARTY_AFFILIATION"].str.upper() == "D").sum()

    rename_map = {
        "LAST_NAME": "last_name",
        "FIRST_NAME": "first_name",
        "MIDDLE_NAME": "middle_name",
        "REGISTRATION_DATE": "registration_date",
        "VOTER_STATUS": "status",
        "PARTY_AFFILIATION": "party_affiliation",
        "RESIDENTIAL_ADDRESS1": "residential_address",
        "RESIDENTIAL_CITY": "city",
        "RESIDENTIAL_ZIP": "zip_code",
        "region_id": "region_id",
    }
    ohio_voter_df = ohio_voter_df.rename(columns=rename_map)

    ohio_voter_df["state_id"] = int(OHIO_FIPS_CODE)

    # Connecting to db
    engine = create_engine(
        f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
    )

    ohio_voter_df.to_sql(
        "voter_registration",
        engine,
        schema="app",
        if_exists="append",
        index=False
    )

affiliated_voters = republican_voters + democratic_voters
unaffiliated_voters = total_voters - affiliated_voters

print("\n============== Ohio Voter Registration Summary ==============")
print(f"Total registered voters:                {total_voters:,d}")
print(f"Voters with designated political party: {affiliated_voters:,d}")
print(f"Republican voters (R):                  {republican_voters:,d}")
print(f"Democratic voters (D):                  {democratic_voters:,d}")
print(f"Unaffiliated / Other voters:            {unaffiliated_voters:,d}")
print("=============================================================")

print("Finished inserting Ohio voter registration data")
