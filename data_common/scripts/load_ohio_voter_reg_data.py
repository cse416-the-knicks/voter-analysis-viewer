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
    "RESIDENTIAL_STATE",
    "RESIDENTIAL_ZIP",
]

total_voters = 0
republican_voters = 0
democratic_voters = 0
unaffiliated_voters = 0

for file in files:
    print(f"=========Processing file: {file}=========")
    data_path = f"../raw/ohio_voter_files/{file}"
    ohio_voter_df = pd.read_csv(data_path, usecols=cols, encoding="cp1252", dtype=str)

    # Address validation block for first 5000 rows of first file only
    if file == "SWVF_1_22.csv":
        print("Running address validation check on first 5000 rows...")

        inferred_cols = [
            "inputAddress",
            "validationGranularity"
        ]
        inferred_addresses_df = pd.read_csv("../processed/inferred_addresses.csv", usecols=inferred_cols, dtype=str).fillna("")

        sample_df = ohio_voter_df.head(5000).copy()

        # Build combined address to match Google's inputAddress
        sample_df["combined_address"] = (
            sample_df["RESIDENTIAL_ADDRESS1"].str.strip() + " " +
            sample_df["RESIDENTIAL_CITY"].str.strip() + " " +
            sample_df["RESIDENTIAL_STATE"].str.strip() + " " +
            sample_df["RESIDENTIAL_ZIP"].str.strip()
        )

        # Make sure the inferred file has the same column name
        inferred_addresses_df = inferred_addresses_df.rename(columns={
            "inputAddress": "combined_address",
            "validationGranularity": "granularity"
        })

        # Merge sample with inferred
        validated_sample_df = sample_df.merge(
            inferred_addresses_df[["combined_address", "granularity"]],
            on="combined_address",
            how="left"
        )
        print(validated_sample_df)

        # Determine which addresses are valid
        def is_valid(granularity):
            if pd.isna(granularity):
                return False
            return "PREMISE" in granularity.upper()

        validated_sample_df["is_valid"] = validated_sample_df["granularity"].apply(is_valid)

        # Summary of validation
        total_checked = len(validated_sample_df)
        valid_count = validated_sample_df["is_valid"].sum()
        invalid_count = total_checked - valid_count
        print(f"Validation summary for first 5000 rows:")
        print(f"  Total checked: {total_checked}")
        print(f"  Valid (has PREMISE granularity): {valid_count}")
        print(f"  Invalid or unclear: {invalid_count}")

        # Save invalid addresses into csv for inspection
        invalid_rows = validated_sample_df[~validated_sample_df["is_valid"]]
        invalid_rows.to_csv("../processed/ohio_invalid_address_check.csv", index=False)
        print(f"Saved {invalid_count} invalid address rows to ohio_invalid_address_check.csv")

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
    ohio_voter_df = ohio_voter_df.drop("RESIDENTIAL_STATE", axis=1)

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
