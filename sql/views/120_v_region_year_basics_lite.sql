CREATE OR REPLACE VIEW app.v_region_year_basics_lite AS
SELECT
  d.region_id,
  d.state_id,
  s.code  AS state_code,
  s.name  AS state_name,
  d.year,
  d.total_registered,
  d.total_ballots_cast,
  d.ballots_by_mail,
  d.early_voting_total,
  d.prov_cast
FROM app.eavs_data d
JOIN app.states s ON s.state_id = d.state_id;