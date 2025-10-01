CREATE OR REPLACE VIEW app.v_device_model_usage AS
SELECT
  dm.device_model_id,
  dm.vendor,
  dm.model_name,
  dm.device_type,
  dm.year_introduced,
  dm.certification,
  COUNT(DISTINCT eu.region_id) AS regions_using,
  SUM(eu.quantity)             AS units_deployed
FROM app.device_model dm
LEFT JOIN app.equipment_usage eu ON eu.device_model_id = dm.device_model_id
GROUP BY dm.device_model_id, dm.vendor, dm.model_name, dm.device_type, dm.year_introduced, dm.certification;

