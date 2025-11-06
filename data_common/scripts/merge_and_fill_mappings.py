import pandas as pd

MASTER_PATH = "../raw/voting_machine_data.csv"
MAPPING_PATH = "../raw/device_model_manual_mapping.csv"
OUT_MASTER = "../processed/voting_machine_full.csv"
OUT_MAPPING = "../processed/device_model_mapping_filled.csv"

master = pd.read_csv(MASTER_PATH, dtype=str).fillna("")
manual_mapping = pd.read_csv(MAPPING_PATH, dtype=str).fillna("")

# Finding all the new models that need to be added to the master list
new_models = manual_mapping[manual_mapping["device_model_id"] == ""].copy()
new_models_df = pd.DataFrame({
    "Manufacturer": "",  # unknown
    "Equipment Type": new_models["device_type_hint"],
    "Model Name": new_models["raw_text"],
    "First Manufactured": "",
    "Last Manufactured": "",
    "OS": "",
    "Firmware Version": "",
    "Battery Life": "",
    "Scanning Rate": "",
    "VVPAT?": "",
    "Paper Capacity": "",
    "Certification Level": "",
    "Security Risks": "",
    "Notes/Misc.": "",
    "Discontinued": ""
})
combined = pd.concat([master, new_models_df], ignore_index=True)
combined.insert(0, "device_model_id", range(1, len(combined) + 1))

# Filling manual mapping with IDs from the combined master list
mapping_filled = manual_mapping.copy()
join_df = combined[["device_model_id", "Model Name", "Equipment Type"]].rename(
    columns={"Model Name": "raw_text", "Equipment Type": "device_type_hint"}
)
mapping_filled = mapping_filled.merge(
    join_df,
    on=["raw_text", "device_type_hint"],
    how="left",
    suffixes=("", "_from_master")
)

# Prefer manually entered id if present
mapping_filled["device_model_id"] = mapping_filled["device_model_id"].replace("", pd.NA)
mapping_filled["device_model_id"] = mapping_filled["device_model_id"].fillna(
    mapping_filled["device_model_id_from_master"]
).astype("string")

mapping_filled = mapping_filled[["raw_text", "device_type_hint", "device_model_id"]]

combined.to_csv(OUT_MASTER, index=False)
mapping_filled.to_csv(OUT_MAPPING, index=False)

print(f"Wrote {OUT_MASTER} ({len(combined)} total rows)")
print(f"Wrote {OUT_MAPPING} ({len(mapping_filled)} mappings filled)")
