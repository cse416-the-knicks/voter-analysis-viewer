CREATE OR REPLACE VIEW app.v_state_year_results AS
SELECT
  g.state_id,
  s.code      AS state_code,
  s.name      AS state_name,
  r.year,
  SUM(r.rep_votes)                 AS rep_votes,
  SUM(r.dem_votes)                 AS dem_votes,
  SUM(COALESCE(r.other_votes,0))   AS other_votes,
  SUM(r.total_votes)               AS total_votes,
  CASE WHEN SUM(r.total_votes) > 0
       THEN SUM(r.rep_votes)::numeric / SUM(r.total_votes) ELSE NULL END AS rep_share,
  CASE WHEN SUM(r.total_votes) > 0
       THEN SUM(r.dem_votes)::numeric / SUM(r.total_votes) ELSE NULL END AS dem_share,
  CASE WHEN SUM(r.total_votes) > 0
       THEN SUM(COALESCE(r.other_votes,0))::numeric / SUM(r.total_votes) ELSE NULL END AS other_share,
  (SUM(r.rep_votes) - SUM(r.dem_votes)) AS margin_raw,
  CASE WHEN SUM(r.total_votes) > 0
       THEN (SUM(r.rep_votes) - SUM(r.dem_votes))::numeric / SUM(r.total_votes) ELSE NULL END AS margin_pct,
  CASE
    WHEN SUM(r.rep_votes) > GREATEST(SUM(r.dem_votes), SUM(COALESCE(r.other_votes,0))) THEN 'R'
    WHEN SUM(r.dem_votes) > GREATEST(SUM(r.rep_votes), SUM(COALESCE(r.other_votes,0))) THEN 'D'
    ELSE 'Other'
  END AS winner
FROM app.election_results r
JOIN app.eavs_geounit g ON g.region_id = r.region_id
JOIN app.states s       ON s.state_id  = g.state_id
GROUP BY g.state_id, s.code, s.name, r.year;