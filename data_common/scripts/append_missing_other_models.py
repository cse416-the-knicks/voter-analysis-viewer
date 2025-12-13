import pandas as pd

EAVS_PATH = "../raw/2024_EAVS_for_Public_Release_V1_xlsx.xlsx"
MAPPING_PATH = "../raw/device_model_manual_mapping.csv"
OUT_PATH = "../raw/device_model_manual_mapping.csv"

INVALID_PATTERNS = [
    "Data not available",
    "Valid skip",
    "Does not apply",
]

eavs_df = pd.read_excel(EAVS_PATH, dtype=str).fillna("")
mapping_df = pd.read_csv(MAPPING_PATH, dtype=str).fillna("")

existing_raw_texts = set(mapping_df["raw_text"])

groups = {
    "DRE no VVPAT": ("F3a", ["F3b_1", "F3b_2", "F3b_3"]),
    "DRE with VVPAT": ("F4a", ["F4b_1", "F4b_2", "F4b_3"]),
    "BMD": ("F5a", ["F5b_1", "F5b_2", "F5b_3"]),
    "Scanner": ("F6a", ["F6b_1", "F6b_2", "F6b_3"]),
}

new_records = []

for device_type, (flag_col, cols) in groups.items():
    if flag_col not in eavs_df.columns:
        continue

    for _, row in eavs_df.iterrows():
        if str(row[flag_col]).strip().lower() != "yes":
            continue

        for col in cols:
            other_col = f"{col}other"

            main_val = str(row.get(col, "")).strip()
            other_val = str(row.get(other_col, "")).strip()

            if main_val:
                val = main_val
                if main_val.lower().startswith("other"):
                    val = other_val
            else:
                val = other_val

            if not val:
                continue

            if val in INVALID_PATTERNS:
                continue

            if val in existing_raw_texts:
                continue

            new_records.append({
                "raw_text": val,
                "device_type_hint": device_type,
                "device_model_id": ""
            })

if new_records:
    new_df = pd.DataFrame(new_records).drop_duplicates(
        subset=["raw_text", "device_type_hint"]
    )

    mapping_df = pd.concat([mapping_df, new_df], ignore_index=True)
    print(f"Appended {len(new_df)} unique new rows.")
else:
    print("No new rows found.")

mapping_df.to_csv(OUT_PATH, index=False)
print(f"Updated mapping written to {OUT_PATH}")
