-- ===========================================
-- Voter registration records (for detailed states)
-- ===========================================
CREATE TABLE app.voter_registration (
    voter_id     SERIAL PRIMARY KEY,                      -- unique voter id

    state_id     INT NOT NULL
                 REFERENCES app.states(state_id),         -- state of registration

    region_id    INT
                 REFERENCES app.eavs_geounit(region_id),  -- filled by prepo-10

    first_name   VARCHAR(50),
    last_name    VARCHAR(50),
    middle_name  VARCHAR(50),

    party_affiliation  VARCHAR(20),                       -- political party
    status             VARCHAR(10),                       -- "Active", "Inactive", "Removed"

    city         VARCHAR(50),
    zip_code     VARCHAR(10),
    residential_address VARCHAR(120),

    registration_date  DATE,                              -- optional registration date

    census_block_id CHAR(15)
                    REFERENCES app.census_block(block_id) -- census block reference
);

-- ================
-- Indexes
-- ================
-- Fast filtering by state and region
CREATE INDEX IF NOT EXISTS idx_voter_registration_state
    ON app.voter_registration (state_id);

CREATE INDEX IF NOT EXISTS idx_voter_registration_region
    ON app.voter_registration (region_id);

-- Useful for party-based lookups
CREATE INDEX IF NOT EXISTS idx_voter_registration_party
    ON app.voter_registration (party_affiliation);

-- Common queries often filter by status
CREATE INDEX IF NOT EXISTS idx_voter_registration_status
    ON app.voter_registration (status);

-- Zip lookups
CREATE INDEX IF NOT EXISTS idx_voter_registration_zip
    ON app.voter_registration (zip_code);
