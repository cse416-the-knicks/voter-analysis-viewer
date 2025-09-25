CREATE OR REPLACE VIEW app.v_regions_bounds AS
SELECT
  g.region_id,
  g.name      AS region_name,
  g.state_id,
  s.code      AS state_code,
  s.name      AS state_name,
  g.geom_boundary  -- stored as text (GeoJSON)
FROM app.eavs_geounit g
JOIN app.states s ON s.state_id = g.state_id
WHERE g.geom_boundary IS NOT NULL;