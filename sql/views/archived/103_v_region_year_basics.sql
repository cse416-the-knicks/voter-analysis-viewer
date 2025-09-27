CREATE OR REPLACE VIEW app.v_region_year_basics AS
SELECT
  g.region_id,
  g.name            AS region_name,
  g.state_id,
  s.code            AS state_code,
  s.name            AS state_name,
  d.year,
  d.total_registered,
  d.total_ballots_cast,
  d.ballots_by_mail,
  d.early_voting_total,
  d.prov_cast
FROM app.eavs_geounit g
JOIN app.states s       ON s.state_id = g.state_id
JOIN app.eavs_data d    ON d.region_id = g.region_id;