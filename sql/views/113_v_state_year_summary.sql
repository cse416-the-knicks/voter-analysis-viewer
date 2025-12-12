CREATE OR REPLACE VIEW app.v_state_year_summary AS
SELECT
  d.state_id,
  s.code AS state_code,
  s.name AS state_name,
  d.year,
  SUM(d.active_registered)   AS active_registered,
  SUM(d.inactive_registered) AS inactive_registered,
  SUM(d.total_registered)    AS total_registered,
  SUM(d.total_ballots_cast)  AS total_ballots_cast,
  SUM(d.early_voting_total)  AS early_voting_total,
  SUM(d.ballots_by_mail)     AS ballots_by_mail,
  SUM(d.ballots_dropbox)     AS ballots_dropbox,
  SUM(d.prov_cast)           AS prov_cast,
  CASE WHEN SUM(d.total_registered) > 0
       THEN SUM(d.active_registered)::numeric / SUM(d.total_registered)
       ELSE NULL END        AS active_voter_rate,
  CASE WHEN SUM(d.total_registered) > 0
       THEN SUM(d.inactive_registered)::numeric / SUM(d.total_registered)
       ELSE NULL END        AS inactive_voter_rate,
  CASE WHEN SUM(d.total_registered) > 0
       THEN SUM(d.total_ballots_cast)::numeric / SUM(d.total_registered)
       ELSE NULL END        AS turnout_rate,
  CASE WHEN SUM(d.total_ballots_cast) > 0
       THEN SUM(d.early_voting_total)::numeric / SUM(d.total_ballots_cast)
       ELSE NULL END        AS early_share,
  CASE WHEN SUM(d.total_ballots_cast) > 0
       THEN SUM(d.ballots_by_mail)::numeric / SUM(d.total_ballots_cast)
       ELSE NULL END        AS mail_share,
  CASE WHEN SUM(d.total_ballots_cast) > 0
       THEN SUM(d.ballots_dropbox)::numeric / SUM(d.total_ballots_cast)
       ELSE NULL END        AS ballots_dropbox_share
FROM app.eavs_data d
JOIN app.states s ON s.state_id = d.state_id
GROUP BY d.state_id, s.code, s.name, d.year;