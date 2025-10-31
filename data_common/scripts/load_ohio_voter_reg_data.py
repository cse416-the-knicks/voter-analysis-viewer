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
    # "SOS_VOTERID",
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

for file in files:
    print(f"=========Processing file: {file}=========")
    data_path = f"../raw/ohio_voter_files/{file}"
    df = pd.read_csv(data_path, usecols=cols, encoding="cp1252", dtype={
        # "SOS_VOTERID": str,
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
    # print('\n'.join(df.columns.tolist()))

    df["region_id"] = (OHIO_FIPS_CODE + df["COUNTY_NUMBER"].str.zfill(3)).str.ljust(10, "0")

    df = df.drop(columns=["COUNTY_NUMBER"])

    rename_map = {
        # "SOS_VOTERID": "voter_id",
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
    df = df.rename(columns=rename_map)

    df["state_id"] = int(OHIO_FIPS_CODE)

    # Connecting to db
    engine = create_engine(
        f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
    )

    df.to_sql(
        "voter_registration",
        engine,
        schema="app",
        if_exists="append",
        index=False
    )

print("Finished inserting Ohio voter registration data")
