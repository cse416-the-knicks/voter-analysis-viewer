-- ===========================================
-- EAVS geounit: local election jurisdictions
-- ===========================================
CREATE TABLE app.eavs_geounit (
    region_id        SERIAL PRIMARY KEY,                 -- join key for facts
    state_id         INT NOT NULL
                     REFERENCES app.states(state_id),    -- parent state

    name             VARCHAR(100) NOT NULL,              -- display name (e.g., Queens)
    eavs_unit_name   VARCHAR(100) NOT NULL,              -- raw name from EAVS codebook
    eavs_unit_code   VARCHAR(15)  NOT NULL,              -- raw code from EAVS codebook

    unit_type        VARCHAR(20)  NOT NULL,              -- "County", "Town", etc

    uses_fips        BOOLEAN NOT NULL DEFAULT TRUE,      -- true if code is FIPS-based

    -- Geometry store as text (GeoJSON). Nullable unless a “detailed” state.
    geom_boundary    TEXT,                               -- MULTIPOLYGON in GeoJson
    centroid         TEXT,                               -- POINT in GeoJson

    region_type      VARCHAR(10),                        -- Urban/Suburban/Rural
    CONSTRAINT eavs_geounit_region_type_chk
        CHECK (region_type IS NULL OR region_type IN ('Urban','Suburban','Rural')),

    -- Uniqueness, region name must be unique within a state
    CONSTRAINT eavs_geounit_state_name_uniq UNIQUE (state_id, name)
);

-- ================
-- Indexes
-- ================
-- Fast filtering by state
CREATE INDEX IF NOT EXISTS idx_eavs_geounit_state_id
    ON app.eavs_geounit (state_id);

-- Optional helper for frequent filters by type within a state (keeps to "indexes only" rule)
CREATE INDEX IF NOT EXISTS idx_eavs_geounit_state_type
    ON app.eavs_geounit (state_id, unit_type);

-- If you often look up by raw EAVS code within a state, this helps (not unique in spec)
CREATE INDEX IF NOT EXISTS idx_eavs_geounit_state_code
    ON app.eavs_geounit (state_id, eavs_unit_code);
