ALTER TABLE app.eavs_data        DROP CONSTRAINT eavs_data_region_id_fkey;
ALTER TABLE app.equipment_usage  DROP CONSTRAINT equipment_usage_region_id_fkey;
ALTER TABLE app.voter_registration DROP CONSTRAINT voter_registration_region_id_fkey;
ALTER TABLE app.election_results DROP CONSTRAINT election_results_region_id_fkey;
ALTER TABLE app.cvap_data        DROP CONSTRAINT cvap_data_region_id_fkey;

ALTER TABLE app.eavs_geounit 
    ALTER COLUMN region_id TYPE VARCHAR(10);


ALTER TABLE app.eavs_data        ALTER COLUMN region_id TYPE VARCHAR(10);
ALTER TABLE app.equipment_usage  ALTER COLUMN region_id TYPE VARCHAR(10);
ALTER TABLE app.voter_registration ALTER COLUMN region_id TYPE VARCHAR(10);
ALTER TABLE app.election_results ALTER COLUMN region_id TYPE VARCHAR(10);
ALTER TABLE app.cvap_data        ALTER COLUMN region_id TYPE VARCHAR(10);


ALTER TABLE app.eavs_data
    ADD CONSTRAINT eavs_data_region_id_fkey
    FOREIGN KEY (region_id) REFERENCES app.eavs_geounit(region_id);

ALTER TABLE app.equipment_usage
    ADD CONSTRAINT equipment_usage_region_id_fkey
    FOREIGN KEY (region_id) REFERENCES app.eavs_geounit(region_id);

ALTER TABLE app.voter_registration
    ADD CONSTRAINT voter_registration_region_id_fkey
    FOREIGN KEY (region_id) REFERENCES app.eavs_geounit(region_id);

ALTER TABLE app.election_results
    ADD CONSTRAINT election_results_region_id_fkey
    FOREIGN KEY (region_id) REFERENCES app.eavs_geounit(region_id);

ALTER TABLE app.cvap_data
    ADD CONSTRAINT cvap_data_region_id_fkey
    FOREIGN KEY (region_id) REFERENCES app.eavs_geounit(region_id);

