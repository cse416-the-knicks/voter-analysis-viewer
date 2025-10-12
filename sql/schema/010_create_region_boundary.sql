
-- ===========================================
-- Geographic boundaries for states and local EAVS units
-- ===========================================

CREATE TABLE app.region_boundary (
    region_id     VARCHAR(10) PRIMARY KEY,           -- FIPS for counties/precincts or
                                                     -- left‑padded 2‑digit FIPS for whole states
    state_id      INT NOT NULL
                   REFERENCES app.states(state_id),  -- parent state
    name          VARCHAR(100) NOT NULL,             -- human‑readable name (state or locality)
    geom_boundary TEXT NOT NULL,                     -- GeoJSON MULTIPOLYGON stored as text
    geom_center   TEXT,                              -- GeoJSON POINT (centre of the feature)                            
    CONSTRAINT uq_region_boundary_state_name UNIQUE (state_id, name)
);

-- ================
-- Indexes
-- ================
-- Fast filtering by state
CREATE INDEX IF NOT EXISTS idx_region_boundary_state_id
    ON app.region_boundary (state_id);

-- Useful for range scans on the string key (ex: prefix lookups)
CREATE INDEX IF NOT EXISTS idx_region_boundary_region
    ON app.region_boundary (region_id);

