CREATE OR REPLACE VIEW app.v_device_model_usage AS
SELECT
    dm.device_model_id,
    dm.manufacturer,
    dm.model_name,
    dm.equipment_type,
    dm.first_manufactured,
    dm.last_manufactured,
    dm.certification_level AS certification,
    dm.os,
    dm.battery_life,
    dm.scanning_rate,
    dm.paper_capacity,
    dm.vvpatt,
    dm.error_rate,
    dm.reliability,
    dm.quality_score,
    COUNT(DISTINCT eu.region_id) AS regions_using,
    COALESCE(SUM(eu.quantity), 0) AS units_deployed
FROM app.device_model dm
LEFT JOIN app.equipment_usage eu
       ON eu.device_model_id = dm.device_model_id
GROUP BY
    dm.device_model_id,
    dm.manufacturer,
    dm.model_name,
    dm.equipment_type,
    dm.first_manufactured,
    dm.last_manufactured,
    dm.certification_level,
    dm.os,
    dm.battery_life,
    dm.scanning_rate,
    dm.paper_capacity,
    dm.vvpatt,
    dm.error_rate,
    dm.reliability,
    dm.quality_score;
