CREATE TABLE app.device_model (
    device_model_id      SERIAL PRIMARY KEY,

    manufacturer         VARCHAR(100),
    equipment_type       VARCHAR(50)  NOT NULL,
    model_name           VARCHAR(100) NOT NULL,

    first_manufactured   DATE,
    last_manufactured    DATE,

    os                   VARCHAR(100),
    firmware_version     VARCHAR(100),

    battery_life         NUMERIC(4,1),   -- hours (averaged)
    scanning_rate        INT,            -- pages/min or ballots/min
    paper_capacity       INT,            -- averaged capacity

    vvpatt               BOOLEAN,
    certification_level  VARCHAR(100),

    security_risks       TEXT,
    notes_misc           TEXT,

    discontinued         BOOLEAN,
    short_description    TEXT,

    error_rate           NUMERIC(4,3),
    reliability          NUMERIC(4,2),
    quality_score        NUMERIC(4,2)
);
