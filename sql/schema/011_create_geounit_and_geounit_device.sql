BEGIN;

-- GEOUNIT TABLE
CREATE TABLE IF NOT EXISTS app.geounit (
  geounit_id   VARCHAR(10) PRIMARY KEY,  -- same id as region_boundary.region_id
  geounit_name VARCHAR(100) NOT NULL,
  geounit_type VARCHAR(30)  NOT NULL,    -- 'state','county','precinct', etc.
  fips_code    VARCHAR(10),
  state_id     INTEGER NOT NULL REFERENCES app.states(state_id) ON DELETE CASCADE,
  year         SMALLINT,
  CONSTRAINT fk_geounit_region
    FOREIGN KEY (geounit_id) REFERENCES app.region_boundary(region_id) ON DELETE CASCADE
);

-- single, non-duplicated index
CREATE INDEX IF NOT EXISTS idx_geounit_state_type
  ON app.geounit (state_id, geounit_type);

-- GEOUNIT DEVICE TABLE
CREATE TABLE IF NOT EXISTS app.geounit_device (
  geounit_device_id BIGSERIAL PRIMARY KEY,
  geounit_id        VARCHAR(10) NOT NULL
                     REFERENCES app.geounit(geounit_id) ON DELETE CASCADE,
  device_model_id   BIGINT NOT NULL
                     REFERENCES app.device_model(device_model_id) ON DELETE RESTRICT,
  start_date        DATE,         -- optional: when this model entered service at this unit
  end_date          DATE,         -- optional: null = still active / unknown
  quantity          INTEGER,      -- optional inventory count
  notes             TEXT,
  -- Prevent accidental duplicates across time slices
  CONSTRAINT uq_geounit_device_span UNIQUE (geounit_id, device_model_id, start_date),
  -- Optional data hygiene: if both dates present, end must be after start
  CONSTRAINT ck_geounit_device_dates CHECK (
    start_date IS NULL OR end_date IS NULL OR end_date > start_date
  )
);

CREATE INDEX IF NOT EXISTS idx_geounit_device_lookup
  ON app.geounit_device (geounit_id, device_model_id);

CREATE INDEX IF NOT EXISTS idx_geounit_device_active
  ON app.geounit_device (geounit_id, end_date);

COMMIT;
