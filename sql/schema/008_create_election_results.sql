-- ===========================================
-- Presidential election results by region and year
-- ===========================================
CREATE TABLE app.election_results (
    region_id   INT NOT NULL
                REFERENCES app.eavs_geounit(region_id),   -- region / jurisdiction

    year        INT NOT NULL,                             -- election year

    rep_votes   INT NOT NULL,                             -- Republican votes
    dem_votes   INT NOT NULL,                             -- Democrat votes
    other_votes INT,                                      -- all other parties

    total_votes INT GENERATED ALWAYS AS                   -- sum of above
                   (rep_votes + dem_votes + COALESCE(other_votes, 0)) STORED,

    CONSTRAINT election_results_pk PRIMARY KEY (region_id, year)
);

-- ================
-- Indexes
-- ================
-- Fast filtering by year
CREATE INDEX IF NOT EXISTS idx_election_results_year
    ON app.election_results (year);

-- Useful composite for region/year lookups
CREATE INDEX IF NOT EXISTS idx_election_results_region_year
    ON app.election_results (region_id, year);
