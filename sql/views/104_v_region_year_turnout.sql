CREATE OR REPLACE VIEW app.v_region_year_turnout AS
SELECT
  region_id,
  year,
  total_registered,
  total_ballots_cast,
  CASE
    WHEN total_registered > 0
    THEN total_ballots_cast::numeric / total_registered
    ELSE NULL
  END AS turnout_rate
FROM app.eavs_data;