-- ===========================================
-- EAVS facts by region and year
-- ===========================================
CREATE TABLE app.eavs_data (
    region_id            INT NOT NULL
                         REFERENCES app.eavs_geounit(region_id),
    year                 INT NOT NULL,                        -- 2016, 2020, 2024

    -- Registration
    active_registered    INT,
    inactive_registered  INT,
    total_registered     INT,
    reg_missing_data     BOOLEAN,

    -- Removals A12*
    total_removed        INT,
    removed_moved        INT,
    removed_felony       INT,
    removed_deceased     INT,
    removed_failed_confirm INT,
    removed_incompetent  INT,
    removed_requested    INT,
    removed_duplicate    INT,
    removed_other        INT,
    del_missing_data     BOOLEAN,

    -- Ballots cast (counts)
    total_ballots_cast   INT,
    ballots_by_mail      INT,
    ballots_in_person_early INT,
    ballots_in_person_eday  INT,
    ballots_dropbox      INT,

    -- Early voting
    early_voting_total   INT,           -- derived in spec, storing as INT 
    early_missing_data   BOOLEAN,

    -- Provisionals E*
    prov_cast                    INT,
    prov_reason_not_in_roll      INT,
    prov_reason_no_id            INT,
    prov_reason_not_eligibe_official INT,
    prov_reason_challenged       INT,
    prov_reason_wrong_precinct   INT,
    prov_reason_name_address     INT,
    prov_reason_mail_ballot_unsurrendered INT,
    prov_reason_hours_extended   INT,
    prov_reason_same_day_reg     INT,
    prov_other                   INT,

    -- Mail rejection C9*
    mail_reject_total        INT,
    mail_reject_late         INT,
    mail_reject_no_sig       INT,
    mail_reject_no_witness_sig INT,
    mail_reject_sig_mismatch INT,
    mail_reject_unofficial_env INT,
    mail_reject_ballot_missing INT,
    mail_reject_no_secrecy_env INT,
    mail_reject_multiple_in_env INT,
    mail_reject_unsealed_env  INT,
    mail_reject_no_postmark   INT,
    mail_reject_no_address    INT,
    mail_reject_voter_deceased INT,   
    mail_reject_duplicate_vote INT,
    mail_reject_missing_docs  INT,
    mail_reject_not_eligible  INT,
    mail_reject_no_application INT,
    mail_reject_other         INT,
    mail_missing_data         BOOLEAN,

    -- Score
    missing_data_score    NUMERIC,      -- unspecified precision in draft

    -- Keys
    CONSTRAINT eavs_data_pk PRIMARY KEY (region_id, year)
);

-- =================
-- Indexes
-- =================
-- Year filter 
CREATE INDEX IF NOT EXISTS idx_eavs_data_year
    ON app.eavs_data (year);

