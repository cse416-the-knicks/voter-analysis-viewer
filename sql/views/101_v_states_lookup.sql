CREATE OR REPLACE VIEW app.v_states_lookup AS
SELECT
  s.state_id,
  s.code  AS state_code,
  s.name  AS state_name
FROM app.states s
ORDER BY s.name;