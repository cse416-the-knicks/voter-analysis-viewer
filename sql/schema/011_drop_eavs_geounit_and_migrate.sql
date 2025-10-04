-- 011_drop_eavs_geounit_and_migrate_v2.sql
-- Purpose:
--  - Remove app.eavs_geounit and any dependent views/constraints.
--  - Add state_id directly to fact tables (if missing) and backfill.
--  - Recreate state-level views without eavs_geounit dependency.

BEGIN;

----------------------------------------------------------------------
-- 0) DROP VIEWS THAT DEPEND ON app.eavs_geounit
-- (include state rollups 113/114 which previously joined through geounit)
----------------------------------------------------------------------

DROP VIEW IF EXISTS app.v_regions_lookup              CASCADE;  -- 102
DROP VIEW IF EXISTS app.v_region_year_basics          CASCADE;  -- 103
DROP VIEW IF EXISTS app.v_region_year_results         CASCADE;  -- 108
DROP VIEW IF EXISTS app.v_region_year_equipment       CASCADE;  -- 109
DROP VIEW IF EXISTS app.v_region_year_cvap            CASCADE;  -- 112
DROP VIEW IF EXISTS app.v_regions_centroids           CASCADE;  -- 118
DROP VIEW IF EXISTS app.v_regions_bounds              CASCADE;  -- 119
DROP VIEW IF EXISTS app.v_state_year_summary          CASCADE;  -- 113 (drop old ver)
DROP VIEW IF EXISTS app.v_state_year_results          CASCADE;  -- 114 (drop old ver)

-- Views that do NOT reference eavs_geounit remain intact:
-- 101, 104, 105, 106, 107, 110, 111, 115, 116, 117

----------------------------------------------------------------------
-- 1) PRESERVE region->state mapping BEFORE dropping eavs_geounit
----------------------------------------------------------------------

CREATE TEMP TABLE tmp_region_state_map AS
SELECT region_id, state_id
FROM app.eavs_geounit;

CREATE INDEX IF NOT EXISTS tmp_region_state_map_rid_idx ON tmp_region_state_map(region_id);

----------------------------------------------------------------------
-- 2) DROP FOREIGN KEYS that reference app.eavs_geounit(region_id)
-- (Constraint names differ by env; drop dynamically.)
----------------------------------------------------------------------

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tc.table_schema, tc.table_name, tc.constraint_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
     AND tc.table_schema = kcu.table_schema
    JOIN information_schema.referential_constraints rc
      ON tc.constraint_name = rc.constraint_name
    JOIN information_schema.constraint_column_usage ccu
      ON rc.unique_constraint_name = ccu.constraint_name
     AND rc.unique_constraint_schema = ccu.constraint_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND ccu.table_schema = 'app'
      AND ccu.table_name = 'eavs_geounit'
      AND ccu.column_name = 'region_id'
  LOOP
    EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT %I;',
                   r.table_schema, r.table_name, r.constraint_name);
  END LOOP;
END $$;

----------------------------------------------------------------------
-- 3) ADD state_id columns directly to fact tables (if missing) & backfill
----------------------------------------------------------------------

-- EAVS data
ALTER TABLE app.eavs_data ADD COLUMN IF NOT EXISTS state_id INT;
UPDATE app.eavs_data d
SET state_id = m.state_id
FROM tmp_region_state_map m
WHERE d.region_id = m.region_id
  AND (d.state_id IS DISTINCT FROM m.state_id);

-- Election results
ALTER TABLE app.election_results ADD COLUMN IF NOT EXISTS state_id INT;
UPDATE app.election_results r
SET state_id = m.state_id
FROM tmp_region_state_map m
WHERE r.region_id = m.region_id
  AND (r.state_id IS DISTINCT FROM m.state_id);

-- CVAP data
ALTER TABLE app.cvap_data ADD COLUMN IF NOT EXISTS state_id INT;
UPDATE app.cvap_data c
SET state_id = m.state_id
FROM tmp_region_state_map m
WHERE c.region_id = m.region_id
  AND (c.state_id IS DISTINCT FROM m.state_id);

-- Voter registration (you already have this column; make sure it's filled)
ALTER TABLE app.voter_registration ADD COLUMN IF NOT EXISTS state_id INT;
UPDATE app.voter_registration v
SET state_id = m.state_id
FROM tmp_region_state_map m
WHERE v.region_id = m.region_id
  AND (v.state_id IS DISTINCT FROM m.state_id);

----------------------------------------------------------------------
-- 4) ENFORCE NOT NULL + FKs to app.states(state_id) (if data complete)
-- If any table has NULL state_id, comment out the SET NOT NULL lines,
-- fix data, then re-run those ALTERs.
----------------------------------------------------------------------

-- Optional diagnostics:
-- SELECT 'eavs_data' tbl, COUNT(*) missing FROM app.eavs_data WHERE state_id IS NULL
-- UNION ALL SELECT 'election_results', COUNT(*) FROM app.election_results WHERE state_id IS NULL
-- UNION ALL SELECT 'cvap_data', COUNT(*) FROM app.cvap_data WHERE state_id IS NULL
-- UNION ALL SELECT 'voter_registration', COUNT(*) FROM app.voter_registration WHERE state_id IS NULL;

ALTER TABLE app.eavs_data          ALTER COLUMN state_id SET NOT NULL;
ALTER TABLE app.election_results   ALTER COLUMN state_id SET NOT NULL;
ALTER TABLE app.cvap_data          ALTER COLUMN state_id SET NOT NULL;
ALTER TABLE app.voter_registration ALTER COLUMN state_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_eavs_data_state') THEN
    ALTER TABLE app.eavs_data
      ADD CONSTRAINT fk_eavs_data_state
      FOREIGN KEY (state_id) REFERENCES app.states(state_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_election_results_state') THEN
    ALTER TABLE app.election_results
      ADD CONSTRAINT fk_election_results_state
      FOREIGN KEY (state_id) REFERENCES app.states(state_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_cvap_data_state') THEN
    ALTER TABLE app.cvap_data
      ADD CONSTRAINT fk_cvap_data_state
      FOREIGN KEY (state_id) REFERENCES app.states(state_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_voter_registration_state') THEN
    ALTER TABLE app.voter_registration
      ADD CONSTRAINT fk_voter_registration_state
      FOREIGN KEY (state_id) REFERENCES app.states(state_id);
  END IF;
END $$;

-- Helpful indexes on the new state_id (no-ops if they already exist)
CREATE INDEX IF NOT EXISTS idx_eavs_data_state_id          ON app.eavs_data(state_id);
CREATE INDEX IF NOT EXISTS idx_election_results_state_id   ON app.election_results(state_id);
CREATE INDEX IF NOT EXISTS idx_cvap_data_state_id          ON app.cvap_data(state_id);
CREATE INDEX IF NOT EXISTS idx_voter_registration_state_id ON app.voter_registration(state_id);

----------------------------------------------------------------------
-- 5) DROP the eavs_geounit table now that dependencies are gone
----------------------------------------------------------------------

DROP TABLE IF EXISTS app.eavs_geounit;

----------------------------------------------------------------------
-- 6) RECREATE STATE VIEWS (geounit-free)
----------------------------------------------------------------------

-- 113
CREATE OR REPLACE VIEW app.v_state_year_summary AS
SELECT
  d.state_id,
  s.code AS state_code,
  s.name AS state_name,
  d.year,
  SUM(d.active_registered)   AS active_registered,
  SUM(d.inactive_registered) AS inactive_registered,
  SUM(d.total_registered)    AS total_registered,
  SUM(d.total_ballots_cast)  AS total_ballots_cast,
  SUM(d.early_voting_total)  AS early_voting_total,
  SUM(d.ballots_by_mail)     AS ballots_by_mail,
  SUM(d.prov_cast)           AS prov_cast,
  CASE WHEN SUM(d.total_registered) > 0
       THEN SUM(d.active_registered)::numeric / SUM(d.total_registered)
       ELSE NULL END        AS active_voter_rate,
  CASE WHEN SUM(d.total_registered) > 0
       THEN SUM(d.inactive_registered)::numeric / SUM(d.total_registered)
       ELSE NULL END        AS inactive_voter_rate,
  CASE WHEN SUM(d.total_registered) > 0
       THEN SUM(d.total_ballots_cast)::numeric / SUM(d.total_registered)
       ELSE NULL END        AS turnout_rate,
  CASE WHEN SUM(d.total_ballots_cast) > 0
       THEN SUM(d.early_voting_total)::numeric / SUM(d.total_ballots_cast)
       ELSE NULL END        AS early_share,
  CASE WHEN SUM(d.total_ballots_cast) > 0
       THEN SUM(d.ballots_by_mail)::numeric / SUM(d.total_ballots_cast)
       ELSE NULL END        AS mail_share
FROM app.eavs_data d
JOIN app.states s ON s.state_id = d.state_id
GROUP BY d.state_id, s.code, s.name, d.year;

-- 114
CREATE OR REPLACE VIEW app.v_state_year_results AS
SELECT
  r.state_id,
  s.code AS state_code,
  s.name AS state_name,
  r.year,
  SUM(r.rep_votes)               AS rep_votes,
  SUM(r.dem_votes)               AS dem_votes,
  SUM(COALESCE(r.other_votes,0)) AS other_votes,
  SUM(r.total_votes)             AS total_votes,
  CASE WHEN SUM(r.total_votes) > 0
       THEN SUM(r.rep_votes)::numeric / SUM(r.total_votes) ELSE NULL END AS rep_share,
  CASE WHEN SUM(r.total_votes) > 0
       THEN SUM(r.dem_votes)::numeric / SUM(r.total_votes) ELSE NULL END AS dem_share,
  CASE WHEN SUM(r.total_votes) > 0
       THEN SUM(COALESCE(r.other_votes,0))::numeric / SUM(r.total_votes) ELSE NULL END AS other_share,
  (SUM(r.rep_votes) - SUM(r.dem_votes)) AS margin_raw,
  CASE WHEN SUM(r.total_votes) > 0
       THEN (SUM(r.rep_votes) - SUM(r.dem_votes))::numeric / SUM(r.total_votes) ELSE NULL END AS margin_pct,
  CASE
    WHEN SUM(r.rep_votes) > GREATEST(SUM(r.dem_votes), SUM(COALESCE(r.other_votes,0))) THEN 'R'
    WHEN SUM(r.dem_votes) > GREATEST(SUM(r.rep_votes), SUM(COALESCE(r.other_votes,0))) THEN 'D'
    ELSE 'Other'
  END AS winner
FROM app.election_results r
JOIN app.states s ON s.state_id = r.state_id
GROUP BY r.state_id, s.code, s.name, r.year;

COMMIT;
