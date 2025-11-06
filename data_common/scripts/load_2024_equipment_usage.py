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

EAVS_PATH = "../raw/2024_EAVS_for_Public_Release_V1_xlsx.xlsx"
MAPPING_PATH = "../processed/device_model_mapping_filled.csv"
OUT_PATH = "../processed/equipment_usage.csv"

eavs = pd.read_excel(EAVS_PATH, dtype=str).fillna("")
mapping = pd.read_csv(MAPPING_PATH, dtype=str).fillna("")

# Preparing mapping dict for quick lookup
map_dict = dict(zip(mapping["raw_text"], mapping["device_model_id"]))

groups = {
    "DRE no VVPAT": ("F3a", ["F3b_1", "F3b_2", "F3b_3"], ["F3c_1", "F3c_2", "F3c_3"]),
    "DRE with VVPAT": ("F4a", ["F4b_1", "F4b_2", "F4b_3"], ["F4c_1", "F4c_2", "F4c_3"]),
    "Ballot Marking Device": ("F5a", ["F5b_1", "F5b_2", "F5b_3"], ["F5c_1", "F5c_2", "F5c_3"]),
    "Scanner": ("F6a", ["F6b_1", "F6b_2", "F6b_3"], ["F6c_1", "F6c_2", "F6c_3"]),
}

records = []

for device_type, (flag_col, model_cols, qty_cols) in groups.items():
    if flag_col not in eavs.columns:
        continue

    for _, row in eavs.iterrows():
        region_id = str(row.get("FIPSCode", "")).strip()
        if not region_id:
            continue

        if str(row[flag_col]).strip().lower() != "yes":
            continue

        for model_col, qty_col in zip(model_cols, qty_cols):
            if model_col not in eavs.columns:
                continue
            raw_text = str(row[model_col]).strip()
            if not raw_text:
                continue

            # "Other (use text box...)" is replaced with that text box if present
            if raw_text.lower().startswith("other") and f"{model_col}other" in eavs.columns:
                raw_text = str(row[f"{model_col}other"]).strip()
            if not raw_text:
                continue

            qty = str(row.get(qty_col, "")).strip()
            try:
                quantity = int(float(qty)) if qty else 0
            except ValueError:
                quantity = 0

            if quantity == 0:
                continue

            device_model_id = map_dict.get(raw_text, "")
            if str(device_model_id).endswith(".0"):
                device_model_id = str(device_model_id)[:-2]

            if device_model_id == "":
                continue

            region_id = region_id.zfill(10)

            records.append({
                "state_id": int(region_id[:2]),
                "region_id": region_id,
                "year": 2024,
                "device_model_id": device_model_id,
                "quantity": quantity
            })

usage_df = pd.DataFrame(records)
# Removing random territories
usage_df = usage_df[usage_df["state_id"] != 60]
usage_df = usage_df[usage_df["state_id"] != 11]
usage_df = usage_df[usage_df["state_id"] != 66]
usage_df = usage_df[usage_df["state_id"] != 69]
usage_df = usage_df[usage_df["state_id"] != 72]
usage_df = usage_df[usage_df["state_id"] != 78]

# Connecting to db
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Inserting into db
usage_df.to_sql(
    "equipment_usage",
    engine,
    schema="app",
    if_exists="append",
    index=False
)

print("Finished inserting 2024 equipment_usage data into the database")
