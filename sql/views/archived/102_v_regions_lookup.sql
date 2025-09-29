CREATE OR REPLACE VIEW app.v_regions_lookup AS
SELECT
  g.region_id,
  g.state_id,
  s.code  AS state_code,
  s.name  AS state_name,
  g.name  AS region_name,
  g.unit_type,
  g.region_type
FROM app.eavs_geounit g
JOIN app.states s ON s.state_id = g.state_id
ORDER BY s.name, g.name;