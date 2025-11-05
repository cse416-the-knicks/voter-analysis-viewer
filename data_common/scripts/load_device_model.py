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

df = pd.read_csv("../processed/voting_machine_full.csv")
df = df.drop(columns=["device_model_id"])

rename_map = {
    "Manufacturer": "vendor",
    "Equipment Type": "device_type",
    "Model Name": "model_name",
    "First Manufactured": "first_manufactured",
    "OS": "underlying_os",
    "Scanning Rate": "scan_rate",
    "Certification Level": "certification",
    "Discontinued": "is_discontinued",
}
df = df[[c for c in rename_map if c in df.columns]]
df = df.rename(columns=rename_map)


# Connecting to db
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
df.to_sql(
    "device_model",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting 2024 device_model data into the database")
