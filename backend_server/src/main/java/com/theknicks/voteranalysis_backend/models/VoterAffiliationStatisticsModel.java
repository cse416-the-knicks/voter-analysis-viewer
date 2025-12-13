package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/*
 This is the data required to fulfill
 GUI.17
*/

@AutoSql(
    collection = "app.voter_registration",
    joining = {"app.eavs_data", "app.eavs_geounit"},
    joinMethod = {"inner", "inner"},
    joinOn = {
      "app.eavs_data.region_id = app.voter_registration.region_id",
      "eavs_geounit.eavs_unit_code = app.voter_registration.region_id"
    },
    groupBy = {"voter_registration.region_id", "eavs_geounit.name"})
public record VoterAffiliationStatisticsModel(
    @SqlColumnName(name = "voter_registration.region_id") String fullRegionId,
    @SqlColumnName(name = "eavs_geounit.name") String countyName,
    @SqlColumnName(name = "sum(case when party_affiliation = 'D' then 1 end)") int democraticTotal,
    @SqlColumnName(name = "sum(case when party_affiliation = 'R' then 1 end)") int republicanTotal,
    @SqlColumnName(
            name = "sum(case when party_affiliation is null or party_affiliation = '' then 1 end)")
        int unaffiliatedTotal,
    @SqlColumnName(name = "max(eavs_data.total_registered)") int registeredVotersTotal,
    @SqlColumnName(name = "max(eavs_data.active_registered)") int activeRegisteredVotersTotal,
    @SqlColumnName(
            name =
                "sum(case when "
                    + "eavs_data.region_id is not null and trim(eavs_data.region_id) <> '' "
                    + "and last_name is not null and trim(last_name) <> '' "
                    + "and first_name is not null and trim(first_name) <> '' "
                    + "and status is not null and trim(status) <> '' "
                    + "and city is not null and trim(city) <> '' "
                    + "and zip_code is not null and trim(zip_code) <> '' "
                    + "and residential_address is not null and trim(residential_address) <> '' "
                    + "and registration_date is not null "
                    + "then 1 else 0 end)")
        int completedRecords,
    @SqlColumnName(
            name =
                "sum(case when "
                    + "eavs_data.region_id is null or trim(eavs_data.region_id) = '' "
                    + "or last_name is null or trim(last_name) = '' "
                    + "or first_name is null or trim(first_name) = '' "
                    + "or status is null or trim(status) = '' "
                    + "or city is null or trim(city) = '' "
                    + "or zip_code is null or trim(zip_code) = '' "
                    + "or residential_address is null or trim(residential_address) = '' "
                    + "or registration_date is null "
                    + "then 1 else 0 end)")
        int incompleteRecords) {
  public VoterAffiliationStatisticsModel(
      int democraticTotal,
      int republicanTotal,
      int unaffiliatedTotal,
      int registeredVotersTotal,
      int activeRegisteredVotersTotal,
      int completedRecords,
      int incompleteRecords) {
    this(
        "0000000000",
        "Aggregated",
        democraticTotal,
        republicanTotal,
        unaffiliatedTotal,
        registeredVotersTotal,
        activeRegisteredVotersTotal,
        completedRecords,
        incompleteRecords);
  }

  public static class Queryable extends AutoSqlQueryable<VoterAffiliationStatisticsModel> {
    public Queryable() {
      super(VoterAffiliationStatisticsModel.class);
    }
  }
}
