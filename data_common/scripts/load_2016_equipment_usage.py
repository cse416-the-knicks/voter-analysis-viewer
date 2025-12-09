import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
import re

# Loading the .env and its values
load_dotenv()
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
database = os.getenv("DB_NAME")

EAVS_PATH = "../raw/EAVS_2016_for_Public_Release_V1.1_0.xlsx"
MAPPING_PATH = "../processed/device_model_mapping_filled.csv"
OUT_PATH = "../processed/equipment_usage_2016.csv"

# Helpers for normalization and parsing

def normalize_text(s):
    if s is None:
        return ""
    s = str(s).lower()
    # Remove anything in parentheses and the parentheses themselves
    s = re.sub(r"\(.*?\)", "", s)
    return s.strip()

def parse_quantity(val):
    if val is None:
        return False, 0
    s = str(val).strip()
    if s == "":
        return False, 0
    try:
        num = float(s)
    except ValueError:
        return False, 0
    if num < 0:
        return False, 0
    return True, int(num)


eavs = pd.read_excel(EAVS_PATH, dtype=str).fillna("")
mapping = pd.read_csv(MAPPING_PATH, dtype=str).fillna("")

# Normalize mapping raw_text and rebuild map_dict on the cleaned key
mapping["raw_text"] = mapping["raw_text"].astype(str).apply(normalize_text)

# Drop rows with empty normalized raw_text so blanks not matched accidentally
mapping = mapping[mapping["raw_text"] != ""]

map_dict = dict(zip(mapping["raw_text"], mapping["device_model_id"]))

sections = {
    "a": {"placeholder_id": "2", "use_placeholder": True},   # DRE no VVPAT
    "b": {"placeholder_id": "3", "use_placeholder": True},   # DRE with VVPAT
    "c": {"placeholder_id": "7", "use_placeholder": True},   # Scanner (Hybrid)
    "d": {"placeholder_id": "7", "use_placeholder": True},   # Scanner (Optical/Digital)
    "h": {"placeholder_id": None, "use_placeholder": False}, # Other 1
    "i": {"placeholder_id": None, "use_placeholder": False}, # Other 2
}

BAD_STATES = {60, 11, 66, 69, 72, 78, 2, 15}

records = []

for _, row in eavs.iterrows():
    region_id = str(row.get("FIPSCode", "")).strip()
    if not region_id:
        continue

    region_id = region_id.zfill(10)
    try:
        state_id = int(region_id[:2])
    except ValueError:
        continue

    for letter, cfg in sections.items():
        number_col = f"F7{letter}_Number"
        make_col = f"F7{letter}_Make"
        model_col = f"F7{letter}_Model"

        if number_col not in eavs.columns:
            continue

        raw_number = row.get(number_col, "")
        is_valid_section, quantity = parse_quantity(raw_number)

        # Section invalid if F7@_Number is not numeric or negative
        if not is_valid_section:
            continue

        if quantity == 0:
            continue

        # Normalize make/model text
        raw_make = normalize_text(row.get(make_col, ""))
        raw_model = normalize_text(row.get(model_col, ""))

        device_model_id = ""

        # Try make first
        if raw_make:
            device_model_id = map_dict.get(raw_make, "")

        # If that failed try model
        if not device_model_id and raw_model:
            device_model_id = map_dict.get(raw_model, "")

        # If still no match:
        if not device_model_id:
            if cfg["use_placeholder"]:
                # For DRE/Scanner sections we can use a placeholder ID
                device_model_id = cfg["placeholder_id"]
            else:
                # For Other 1/Other 2 (h/i) skip if we can't map
                continue

        # Strip any .0 that might sneak in
        if str(device_model_id).endswith(".0"):
            device_model_id = str(device_model_id)[:-2]

        if device_model_id == "":
            continue

        records.append({
            "state_id": state_id,
            "region_id": region_id,
            "year": 2016,
            "device_model_id": device_model_id,
            "quantity": quantity
        })

usage_df = pd.DataFrame(records)

# Removing random territories
usage_df = usage_df[~usage_df["state_id"].isin(BAD_STATES)]

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

print("Finished inserting 2016 equipment_usage data into the database")
