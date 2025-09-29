CREATE OR REPLACE VIEW app.v_region_year_equipment_lite AS
SELECT
  eu.region_id,
  eu.state_id,
  s.code AS state_code,
  s.name AS state_name,
  eu.year,
  eu.device_model_id,
  dm.vendor,
  dm.model_name,
  dm.device_type,
  eu.quantity
FROM app.equipment_usage eu
JOIN app.states s        ON s.state_id  = eu.state_id
JOIN app.device_model dm ON dm.device_model_id = eu.device_model_id;