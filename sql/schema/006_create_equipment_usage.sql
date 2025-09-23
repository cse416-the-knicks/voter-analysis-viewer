-- ===========================================
-- Equipment usage by state/region and year
-- ===========================================
CREATE TABLE app.equipment_usage (
    usage_id        SERIAL PRIMARY KEY,                         -- row id

    state_id        INT NOT NULL
                    REFERENCES app.states(state_id),            -- deployment state

    region_id       INT
                    REFERENCES app.eavs_geounit(region_id),     -- optional county/town

    year            INT NOT NULL,                               -- election year

    device_model_id INT NOT NULL
                    REFERENCES app.device_model(device_model_id), -- device model

    quantity        INT NOT NULL DEFAULT 0,                     -- units in use
    avg_age         DECIMAL(4,1)                                -- optional avg device age
);

-- ================
-- Indexes
-- ================
-- frequent filters
CREATE INDEX IF NOT EXISTS idx_equipment_usage_state
    ON app.equipment_usage (state_id);

CREATE INDEX IF NOT EXISTS idx_equipment_usage_region
    ON app.equipment_usage (region_id);

CREATE INDEX IF NOT EXISTS idx_equipment_usage_year
    ON app.equipment_usage (year);

CREATE INDEX IF NOT EXISTS idx_equipment_usage_device
    ON app.equipment_usage (device_model_id);

-- helpful composites for common queries (state/year; region/year)
CREATE INDEX IF NOT EXISTS idx_equipment_usage_state_year
    ON app.equipment_usage (state_id, year);

CREATE INDEX IF NOT EXISTS idx_equipment_usage_region_year
    ON app.equipment_usage (region_id, year);
