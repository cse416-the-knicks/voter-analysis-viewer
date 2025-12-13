package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;
import java.util.Date;
import java.util.Optional;

@AutoSql(collection = "app.voter_registration")
public record VoterRegistrationDataModel(
    @SqlColumnName(name = "region_id") String regionId, // EAVS geounit
    @SqlColumnName(name = "first_name") String firstName,
    @SqlColumnName(name = "middle_name") String middleName,
    @SqlColumnName(name = "last_name") String lastName,
    @SqlColumnName(name = "party_affiliation") String partyAffiliation,
    @SqlColumnName(name = "status") String status,
    @SqlColumnName(name = "city") String city,
    @SqlColumnName(name = "zip_code") String zipCode,
    @SqlColumnName(name = "residential_address") String residentialAddress,
    @SqlColumnName(name = "registration_date") Date registrationDate,
    @SqlColumnName(name = "granularity") String granularity,
    @SqlColumnName(name = "is_valid") Optional<Boolean> verifiedValid,
    @SqlColumnName(
            name = "CASE WHEN region_id IS NULL OR TRIM(region_id) = '' " +
                    "OR last_name IS NULL OR TRIM(last_name) = '' " +
                    "OR first_name IS NULL OR TRIM(first_name) = '' " +
                    "OR status IS NULL OR TRIM(status) = '' " +
                    "OR city IS NULL OR TRIM(city) = '' " +
                    "OR zip_code IS NULL OR TRIM(zip_code) = '' " +
                    "OR residential_address IS NULL OR TRIM(residential_address) = '' " +
                    "OR registration_date IS NULL " +
                    "THEN FALSE ELSE TRUE END"
    ) boolean dataCompleted) {
  public static class Queryable extends AutoSqlQueryable<VoterRegistrationDataModel> {
    public Queryable() {
      super(VoterRegistrationDataModel.class);
    }
  }
}
