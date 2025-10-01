CREATE OR REPLACE VIEW app.v_region_year_equipment_summary AS
SELECT
  eu.region_id,
  eu.year,
  SUM(eu.quantity) AS total_devices
FROM app.equipment_usage eu
GROUP BY eu.region_id, eu.year;