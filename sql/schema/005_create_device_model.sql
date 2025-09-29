-- ===========================================
-- Voting device catalog
-- ===========================================
CREATE TABLE app.device_model (
    device_model_id SERIAL PRIMARY KEY,          -- unique model key

    vendor          VARCHAR(50) NOT NULL,        -- manufacturer
    model_name      VARCHAR(50) NOT NULL,        -- model identifier

    device_type     VARCHAR(20) NOT NULL,        -- category
    description     TEXT,                        -- short description

    year_introduced SMALLINT,                    -- year introduced

    certification   VARCHAR(20),                 -- VVSG certification version
    underlying_os   VARCHAR(30),                 -- operating system

    scan_rate       SMALLINT,                    -- ballots per unit time
    error_rate      DECIMAL(4,3),                -- observed error rate
    reliability     DECIMAL(3,1),                -- reliability score
    quality_score   DECIMAL(3,2),                -- quality measure

    is_discontinued BOOLEAN DEFAULT FALSE,       -- true if discontinued

    CONSTRAINT uq_device_vendor_model UNIQUE (vendor, model_name)
);

-- ================
-- Indexes
-- ================
-- Fast lookups by vendor
CREATE INDEX IF NOT EXISTS idx_device_model_vendor
    ON app.device_model (vendor);

-- Filtering by device_type
CREATE INDEX IF NOT EXISTS idx_device_model_type
    ON app.device_model (device_type);

-- Filtering by certification
CREATE INDEX IF NOT EXISTS idx_device_model_certification
    ON app.device_model (certification);

-- Year introduced can be useful for timeline queries
CREATE INDEX IF NOT EXISTS idx_device_model_year
    ON app.device_model (year_introduced);
