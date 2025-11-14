import pandas as pd

EAVS_PATH = "../raw/2024_EAVS_for_Public_Release_V1_xlsx.xlsx"
OUT_PATH = "../raw/device_model_manual_mapping.csv"

df = pd.read_excel(EAVS_PATH, dtype=str).fillna("")

groups = {
    "DRE no VVPAT": ("F3a", ["F3b_1", "F3b_2", "F3b_3"]),
    "DRE with VVPAT": ("F4a", ["F4b_1", "F4b_2", "F4b_3"]),
    "BMD": ("F5a", ["F5b_1", "F5b_2", "F5b_3"]),
    "Scanner": ("F6a", ["F6b_1", "F6b_2", "F6b_3"]),
}

records = []

for device_type, (flag_col, cols) in groups.items():
    if flag_col not in df.columns:
        continue
    for _, row in df.iterrows():
        # Only process if the jurisdiction uses this device type
        if str(row[flag_col]).strip().lower() != "yes":
            continue
        for col in cols:
            if col not in df.columns:
                continue
            val = str(row[col]).strip()
            if not val:
                continue
            # Handling Other column
            if val.lower().startswith("other") and f"{col}other" in df.columns:
                val = str(row[f"{col}other"]).strip()
            if not val:
                continue
            records.append({
                "raw_text": val,
                "device_type_hint": device_type
            })

unique_df = pd.DataFrame(records).drop_duplicates(subset=["raw_text"]).reset_index(drop=True)
unique_df["device_model_id"] = ""  # blank column for manual mapping

# Removing invalid model name entries
INVALID_PATTERNS = [
    "Data not available",
    "Valid skip",
    "Does not apply",
]
unique_df = unique_df[
    ~unique_df["raw_text"].isin(INVALID_PATTERNS)
]

unique_df.to_csv(OUT_PATH, index=False)
print(f"Wrote {OUT_PATH} with {len(unique_df)} unique model entries")
