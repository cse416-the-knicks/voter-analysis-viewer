CREATE OR REPLACE VIEW app.v_region_year_provisional_rates AS
SELECT
  d.region_id,
  d.year,
  d.prov_cast,
  d.total_ballots_cast,
  CASE WHEN d.total_ballots_cast > 0
       THEN d.prov_cast::numeric / d.total_ballots_cast
       ELSE NULL END AS provisional_rate
FROM app.eavs_data d;