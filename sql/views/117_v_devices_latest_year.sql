CREATE OR REPLACE VIEW app.v_devices_latest_year AS
WITH last AS (SELECT MAX(year) AS y FROM app.equipment_usage)
SELECT eu.*
FROM app.equipment_usage eu
CROSS JOIN last
WHERE eu.year = last.y;