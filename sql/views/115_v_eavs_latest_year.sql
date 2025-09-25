CREATE OR REPLACE VIEW app.v_eavs_latest_year AS
WITH last AS (SELECT MAX(year) AS y FROM app.eavs_data)
SELECT d.*
FROM app.eavs_data d
CROSS JOIN last
WHERE d.year = last.y;