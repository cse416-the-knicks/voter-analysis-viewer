CREATE OR REPLACE VIEW app.v_region_year_cvap_lite AS
SELECT
  c.region_id,
  c.state_id,
  s.code AS state_code,
  s.name AS state_name,
  c.estimate_year AS year,
  c.cvap_total,
  c.cvap_white,
  c.cvap_black,
  c.cvap_hispanic,
  c.cvap_asian,
  c.cvap_other
FROM app.cvap_data c
JOIN app.states s ON s.state_id = c.state_id;