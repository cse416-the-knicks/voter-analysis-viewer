-- ================================
-- States Table
-- ================================
CREATE TABLE app.states (
    state_id SERIAL PRIMARY KEY,                 -- Unique state key
    name VARCHAR(50) NOT NULL,                   -- Full state name
    code CHAR(2) NOT NULL UNIQUE,                -- USPS code (NY, RI, CA, etc.)

    -- Replace with placeholders or JSON if PostGIS unavailable.
    geom_boundary TEXT,                          -- Store WKT or GeoJSON string if no PostGIS
    geom_center   TEXT,                          -- Same as above

    map_zoom_level INT NOT NULL,                 -- Zoom level for maps

    -- Registration policies
    registration_method VARCHAR(6) NOT NULL CHECK (
        registration_method IN ('opt-in','opt-out')
    ),
    same_day_registration BOOLEAN NOT NULL,
    felony_disenfranchisement SMALLINT NOT NULL CHECK (
        felony_disenfranchisement BETWEEN 1 AND 4
    ),

    -- Population + political stats
    population_total INT,
    citizens_of_voting_age_population INT,
    house_seats_rep INT,
    house_seats_dem INT,
    redistricting_control VARCHAR(20),
    dominant_party CHAR(1) CHECK (dominant_party IN ('R','D'))
);

-- Useful indexes
CREATE INDEX idx_states_name ON app.states (name);
CREATE INDEX idx_states_redistricting ON app.states (redistricting_control);
