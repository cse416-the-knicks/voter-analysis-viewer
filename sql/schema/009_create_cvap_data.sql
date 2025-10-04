-- ===========================================
-- CVAP (Citizen Voting Age Population) data
-- ===========================================
CREATE TABLE app.cvap_data (
    region_id     VARCHAR(10) NOT NULL,                    -- jurisdiction
    state_id      INT NOT NULL
                  REFERENCES app.states(state_id),         -- state of registration

    estimate_year SMALLINT NOT NULL,                       -- year of estimate

    cvap_total    INT NOT NULL,                            -- total CVAP
    cvap_white    INT,
    cvap_black    INT,
    cvap_hispanic INT,
    cvap_asian    INT,
    cvap_other    INT,

    CONSTRAINT cvap_data_pk PRIMARY KEY (region_id, estimate_year)
);

-- ================
-- Indexes
-- ================
-- Fast filtering by year
CREATE INDEX IF NOT EXISTS idx_cvap_data_year
    ON app.cvap_data (estimate_year);

-- Useful composite for region/year lookups
CREATE INDEX IF NOT EXISTS idx_cvap_data_region_year
    ON app.cvap_data (region_id, estimate_year);

CREATE INDEX IF NOT EXISTS idx_cvap_data_state_id
    ON app.cvap_data (state_id);
