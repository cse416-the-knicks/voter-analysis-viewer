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
CVAP_YEAR = 2023
EAVS_YEAR = 2024

OUTPUT_CSV = "../processed/tx_cvap_rejected_ballots_data.csv"

query = f"""
SELECT
    c.region_id,

    -- CVAP counts
    c.cvap_white,
    c.cvap_black,
    c.cvap_hispanic,
    c.cvap_asian,
    c.cvap_other,
    c.cvap_total,

    -- Ballot counts for rejection analysis
    ef.total_ballots_cast,
    ef.mail_reject_total

FROM app.cvap_data c

JOIN app.eavs_data ef
    ON c.region_id = ef.region_id
   AND c.state_id = ef.state_id
   AND ef.year = {EAVS_YEAR}

WHERE c.state_id = (
    SELECT state_id FROM app.states WHERE code = '{STATE_ABBR}'
)
  AND c.estimate_year = {CVAP_YEAR}
  AND ef.total_ballots_cast > 0
  AND ef.mail_reject_total IS NOT NULL

ORDER BY c.region_id;
"""

cvap_rejection_df = pd.read_sql(query, engine)
cvap_rejection_df.to_csv(OUTPUT_CSV, index=False)
