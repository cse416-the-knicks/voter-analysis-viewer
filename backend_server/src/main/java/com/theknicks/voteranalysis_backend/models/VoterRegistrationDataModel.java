package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;
import java.util.Date;

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
    @SqlColumnName(name = "registration_date") Date registrationDate) {
  public static class Queryable extends AutoSqlQueryable<VoterRegistrationDataModel> {
    public Queryable() {
      super(VoterRegistrationDataModel.class);
    }
  }
}
