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

voting_machine_df = pd.read_csv("../processed/voting_machine_full.csv")
voting_machine_df = voting_machine_df.drop(columns=["device_model_id"])

rename_map = {
    "Manufacturer": "manufacturer",
    "Equipment Type": "equipment_type",
    "Model Name": "model_name",
    "First Manufactured": "first_manufactured",
    "Last Manufactured": "last_manufactured",
    "OS": "os",
    "Firmware Version": "firmware_version",
    "Battery Life": "battery_life",
    "Scanning Rate": "scanning_rate",
    "Paper Capacity": "paper_capacity",
    "VVPAT?": "vvpatt",
    "Certification Level": "certification_level",
    "Security Risks": "security_risks",
    "Notes/Misc.": "notes_misc",
    "Discontinued": "discontinued",
    "Error Score": "error_rate",
    "Reliability Score": "reliability",
    "Final Quality Score": "quality_score",
}
voting_machine_df = voting_machine_df[[c for c in rename_map if c in voting_machine_df.columns]]
voting_machine_df = voting_machine_df.rename(columns=rename_map)

# Connecting to db
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
voting_machine_df.to_sql(
    "device_model",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting 2024 device_model data into the database")
