CREATE OR REPLACE VIEW app.v_region_year_early_mail_rates AS
SELECT
  d.region_id,
  d.year,
  d.early_voting_total,
  d.ballots_by_mail,
  d.total_ballots_cast,
  CASE WHEN d.total_ballots_cast > 0
       THEN d.early_voting_total::numeric / d.total_ballots_cast
       ELSE NULL END AS early_share,
  CASE WHEN d.total_ballots_cast > 0
       THEN d.ballots_by_mail::numeric / d.total_ballots_cast
       ELSE NULL END AS mail_share
FROM app.eavs_data d;