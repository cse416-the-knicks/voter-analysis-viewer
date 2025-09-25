CREATE OR REPLACE VIEW app.v_region_year_mail_rejects AS
SELECT
  d.region_id,
  d.year,
  d.ballots_by_mail,
  d.mail_reject_total,
  CASE WHEN d.ballots_by_mail > 0
       THEN d.mail_reject_total::numeric / d.ballots_by_mail
       ELSE NULL END AS mail_reject_rate
FROM app.eavs_data d;