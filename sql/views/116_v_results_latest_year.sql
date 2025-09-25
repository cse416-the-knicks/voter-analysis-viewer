CREATE OR REPLACE VIEW app.v_results_latest_year AS
WITH last AS (SELECT MAX(year) AS y FROM app.election_results)
SELECT r.*
FROM app.election_results r
CROSS JOIN last
WHERE r.year = last.y;