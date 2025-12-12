import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
import numpy as np
import matplotlib.pyplot as plt

load_dotenv()
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
database = os.getenv("DB_NAME")

engine = create_engine(
    f"postgresql://{user}:{password}@localhost:5433/{database}"
)

STATE_ABBR = "TX"
EQUIPMENT_YEAR = 2024
CVAP_YEAR = 2023

OUTPUT_CSV = "../processed/tx_cvap_equipment_data.csv"

query = f"""
WITH county_equipment_quality AS (
    SELECT
        eu.region_id,
        eu.state_id,
        SUM(eu.quantity * dm.quality_score) / SUM(eu.quantity) AS equipment_quality
    FROM app.equipment_usage eu
    JOIN app.device_model dm
        ON eu.device_model_id = dm.device_model_id
    WHERE eu.state_id = (
        SELECT state_id FROM app.states WHERE code = '{STATE_ABBR}'
    )
      AND eu.year = {EQUIPMENT_YEAR}
      AND eu.quantity > 0
      AND dm.quality_score IS NOT NULL
    GROUP BY eu.region_id, eu.state_id
)
SELECT
    c.region_id,
    c.cvap_white,
    c.cvap_black,
    c.cvap_hispanic,
    c.cvap_asian,
    c.cvap_other,
    c.cvap_total,
    ceq.equipment_quality
FROM app.cvap_data c
JOIN county_equipment_quality ceq
    ON c.region_id = ceq.region_id
   AND c.state_id = ceq.state_id
WHERE c.state_id = (
    SELECT state_id FROM app.states WHERE code = '{STATE_ABBR}'
)
  AND c.estimate_year = {CVAP_YEAR}
ORDER BY c.region_id;
"""


cvap_equipment_df = pd.read_sql(query, engine)

assert cvap_equipment_df["region_id"].is_unique, "Duplicate counties detected"
assert cvap_equipment_df["equipment_quality"].between(0, 1).all(), "Quality score out of range"
cvap_cols = [
    "cvap_white",
    "cvap_black",
    "cvap_hispanic",
    "cvap_asian",
    "cvap_other",
    "cvap_total",
]

# Compute per-county CVAP totals
cvap_totals = cvap_equipment_df[cvap_cols].sum(axis=1)

# Compute fractions
cvap_fractions = cvap_equipment_df[cvap_cols].div(cvap_totals, axis=0)

# Allow tiny floating-point error
assert (
    (cvap_fractions.sum(axis=1) - 1).abs() < 1e-6
).all(), "CVAP fractions do not sum to 1 for all counties"

cvap_equipment_df.to_csv(OUTPUT_CSV, index=False)
