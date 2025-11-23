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
    @SqlColumnName(name = "max(eavs_data.active_registered)") int activeRegisteredVotersTotal) {
  public VoterAffiliationStatisticsModel(
      int democraticTotal,
      int republicanTotal,
      int unaffiliatedTotal,
      int registeredVotersTotal,
      int activeRegisteredVotersTotal) {
    this(
        "0000000000",
        "Aggregated",
        democraticTotal,
        republicanTotal,
        unaffiliatedTotal,
        registeredVotersTotal,
        activeRegisteredVotersTotal);
  }

  public static class Queryable extends AutoSqlQueryable<VoterAffiliationStatisticsModel> {
    public Queryable() {
      super(VoterAffiliationStatisticsModel.class);
    }
  }
}
