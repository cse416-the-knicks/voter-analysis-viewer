#!/usr/bin/env python3
import os

import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load DB credentials from .env
load_dotenv()
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
database = os.getenv("DB_NAME")

MAPPING_PATH = "../processed/device_model_mapping_filled.csv"

# Same device groups for 2018, 2020, 2022
DEFAULT_GROUPS = {
    "DRE no VVPAT": (
        "F5a",
        ["F5b_1", "F5b_2", "F5b_3"],
        ["F5c_1", "F5c_2", "F5c_3"],
    ),
    "DRE with VVPAT": (
        "F6a",
        ["F6b_1", "F6b_2", "F6b_3"],
        ["F6c_1", "F6c_2", "F6c_3"],
    ),
    "BMD": (
        "F7a",
        ["F7b_1", "F7b_2", "F7b_3"],
        ["F7c_1", "F7c_2", "F7c_3"],
    ),
    "Scanner": (
        "F8a",
        ["F8b_1", "F8b_2", "F8b_3"],
        ["F8c_1", "F8c_2", "F8c_3"],
    ),
}

# 2024 changed the column numbers
GROUPS_2024 = {
    "DRE no VVPAT": (
        "F3a",
        ["F3b_1", "F3b_2", "F3b_3"],
        ["F3c_1", "F3c_2", "F3c_3"],
    ),
    "DRE with VVPAT": (
        "F4a",
        ["F4b_1", "F4b_2", "F4b_3"],
        ["F4c_1", "F4c_2", "F4c_3"],
    ),
    "BMD": (
        "F5a",
        ["F5b_1", "F5b_2", "F5b_3"],
        ["F5c_1", "F5c_2", "F5c_3"],
    ),
    "Scanner": (
        "F6a",
        ["F6b_1", "F6b_2", "F6b_3"],
        ["F6c_1", "F6c_2", "F6c_3"],
    ),
}

# Year-specific EAVS paths + which groups to use
YEAR_CONFIG = {
    2018: {
        "eavs_path": "../raw/EAVS_2018_for_Public_Release_Updates3.xlsx",
        "groups": DEFAULT_GROUPS,
    },
    2020: {
        "eavs_path": "../raw/2020_EAVS_for_Public_Release_V1.2.xlsx",
        "groups": DEFAULT_GROUPS,
    },
    2022: {
        "eavs_path": "../raw/2022_EAVS_for_Public_Release_V1.1.xlsx",
        "groups": DEFAULT_GROUPS,
    },
    2024: {
        "eavs_path": "../raw/2024_EAVS_for_Public_Release_V1_xlsx.xlsx",
        "groups": GROUPS_2024,
    },
}

# Territories / non-states to drop
BAD_STATES = {60, 11, 66, 69, 72, 78, 2, 15}


def build_equipment_usage(year, eavs, map_dict, groups, engine):
    records = []

    for device_type, (flag_col, model_cols, qty_cols) in groups.items():
        if flag_col not in eavs.columns:
            continue

        for _, row in eavs.iterrows():
            region_id = str(row.get("FIPSCode", "")).strip()
            if not region_id:
                continue

            # Only rows where this device type is actually used
            if str(row.get(flag_col, "")).strip().lower() != "yes":
                continue

            for model_col, qty_col in zip(model_cols, qty_cols):
                if model_col not in eavs.columns:
                    continue

                main_val = str(row.get(model_col, "")).strip()
                other_val = str(row.get(f"{model_col}other", "")).strip()

                raw_text = main_val
                if main_val.lower().startswith("other"):
                    raw_text = other_val
                elif not main_val:
                    raw_text = other_val

                if not raw_text:
                    continue

                qty_str = str(row.get(qty_col, "")).strip()
                try:
                    quantity = int(float(qty_str)) if qty_str else 0
                except ValueError:
                    quantity = 0

                if quantity == 0:
                    continue

                device_model_id = map_dict.get(raw_text, "")
                
                if str(device_model_id).endswith(".0"):
                    device_model_id = str(device_model_id)[:-2]

                if device_model_id == "":
                    continue

                region_id_padded = region_id.zfill(10)

                records.append(
                    {
                        "state_id": int(region_id_padded[:2]),
                        "region_id": region_id_padded,
                        "year": year,
                        "device_model_id": device_model_id,
                        "quantity": quantity,
                    }
                )

    if not records:
        print(f"No data for {year}, skipping insert")
        return

    usage_df = pd.DataFrame(records)

    # Drop territories/non-states
    usage_df = usage_df[~usage_df["state_id"].isin(BAD_STATES)]

    usage_df.to_sql(
        "equipment_usage",
        engine,
        schema="app",
        if_exists="append",
        index=False,
    )

    print(f"Finished inserting {year} equipment_usage data into the database")

# Load mapping
mapping = pd.read_csv(MAPPING_PATH, dtype=str).fillna("")
map_dict = dict(zip(mapping["raw_text"], mapping["device_model_id"]))

# Create DB engine
engine = create_engine(
    f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
)

# Loop over all years in order
for year in sorted(YEAR_CONFIG.keys()):
    cfg = YEAR_CONFIG[year]
    print(f"Processing equipment_usage for {year}")

    eavs = pd.read_excel(cfg["eavs_path"], dtype=str).fillna("")

    build_equipment_usage(year, eavs, map_dict, cfg["groups"], engine)
