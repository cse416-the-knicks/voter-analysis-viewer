CREATE OR REPLACE VIEW app.v_region_year_results AS
SELECT
  r.region_id,
  g.name      AS region_name,
  g.state_id,
  s.code      AS state_code,
  s.name      AS state_name,
  r.year,
  r.rep_votes,
  r.dem_votes,
  COALESCE(r.other_votes, 0)           AS other_votes,
  r.total_votes,
  CASE WHEN r.total_votes > 0 THEN r.rep_votes::numeric / r.total_votes ELSE NULL END AS rep_share,
  CASE WHEN r.total_votes > 0 THEN r.dem_votes::numeric / r.total_votes ELSE NULL END AS dem_share,
  CASE WHEN r.total_votes > 0 THEN COALESCE(r.other_votes,0)::numeric / r.total_votes ELSE NULL END AS other_share,
  (r.rep_votes - r.dem_votes)          AS margin_raw,
  CASE WHEN r.total_votes > 0 THEN (r.rep_votes - r.dem_votes)::numeric / r.total_votes ELSE NULL END AS margin_pct,
  CASE
    WHEN r.rep_votes > GREATEST(r.dem_votes, COALESCE(r.other_votes,0)) THEN 'R'
    WHEN r.dem_votes > GREATEST(r.rep_votes, COALESCE(r.other_votes,0)) THEN 'D'
    ELSE 'Other'
  END AS winner
FROM app.election_results r
JOIN app.eavs_geounit g ON g.region_id = r.region_id
JOIN app.states s       ON s.state_id = g.state_id;