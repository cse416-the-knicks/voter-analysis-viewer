CREATE OR REPLACE VIEW app.v_state_year_summary AS
SELECT
  g.state_id,
  s.code      AS state_code,
  s.name      AS state_name,
  d.year,
  SUM(d.total_registered)    AS total_registered,
  SUM(d.total_ballots_cast)  AS total_ballots_cast,
  SUM(d.early_voting_total)  AS early_voting_total,
  SUM(d.ballots_by_mail)     AS ballots_by_mail,
  SUM(d.prov_cast)           AS prov_cast,
  CASE WHEN SUM(d.total_registered) > 0
       THEN SUM(d.total_ballots_cast)::numeric / SUM(d.total_registered)
       ELSE NULL END         AS turnout_rate,
  CASE WHEN SUM(d.total_ballots_cast) > 0
       THEN SUM(d.early_voting_total)::numeric / SUM(d.total_ballots_cast)
       ELSE NULL END         AS early_share,
  CASE WHEN SUM(d.total_ballots_cast) > 0
       THEN SUM(d.ballots_by_mail)::numeric / SUM(d.total_ballots_cast)
       ELSE NULL END         AS mail_share
FROM app.eavs_data d
JOIN app.eavs_geounit g ON g.region_id = d.region_id
JOIN app.states s       ON s.state_id  = g.state_id
GROUP BY g.state_id, s.code, s.name, d.year;