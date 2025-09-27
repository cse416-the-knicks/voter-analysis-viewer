CREATE OR REPLACE VIEW app.v_regions_centroids AS
SELECT
  g.region_id,
  g.name      AS region_name,
  g.state_id,
  s.code      AS state_code,
  s.name      AS state_name,
  g.centroid  -- stored as text (POINT in WKT/GeoJSON)
FROM app.eavs_geounit g
JOIN app.states s ON s.state_id = g.state_id
WHERE g.centroid IS NOT NULL;