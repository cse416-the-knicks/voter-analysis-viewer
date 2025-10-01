-- ===========================================
-- Census block centroids (for bubble chart overlays)
-- ===========================================
CREATE TABLE app.census_block (
    block_id    CHAR(15) PRIMARY KEY,               -- Census Block FIPS (unique)

    state_id    INT NOT NULL
                REFERENCES app.states(state_id),    -- parent state

    -- Geometry center point 
    geom_center TEXT NOT NULL                       -- store as GeoJSON string
);

-- ================
-- Indexes
-- ================
-- Fast filtering by state
CREATE INDEX IF NOT EXISTS idx_census_block_state_id
    ON app.census_block (state_id);
