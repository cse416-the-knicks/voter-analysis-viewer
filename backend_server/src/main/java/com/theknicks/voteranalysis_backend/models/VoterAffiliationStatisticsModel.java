package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/*
 This is the data required to fulfill
 GUI.17, and is a custom aggregation without SQL.

 SELECT
    voter_registration.region_id,
	eavs_geounit.name,
    SUM(CASE WHEN party_affiliation = 'R' THEN 1 ELSE 0 END) AS republican_count,
    SUM(CASE WHEN party_affiliation = 'D' THEN 1 ELSE 0 END) AS democrat_count,
    SUM(CASE WHEN party_affiliation IS NULL OR party_affiliation = '' THEN 1 ELSE 0 END) AS unaffiliated_count,
    max(eavs_data.total_registered) AS total_registered -- or MAX(...) if one per region
FROM voter_registration
JOIN eavs_data ON eavs_data.region_id = voter_registration.region_id
JOIN eavs_geounit ON eavs_geounit.eavs_unit_code = voter_registration.region_id
WHERE eavs_data."year" = 2024
GROUP BY voter_registration.region_id, eavs_geounit.name;
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
    @SqlColumnName(name = "max(eavs_data.total_registered)") int totalRegisteredVoters) {
  public VoterAffiliationStatisticsModel(
      int democraticTotal, int republicanTotal, int unaffiliatedTotal, int totalRegisteredVoters) {
    this(
        "0000000000",
        "Aggregated",
        democraticTotal,
        republicanTotal,
        unaffiliatedTotal,
        totalRegisteredVoters);
  }

  public static class Queryable extends AutoSqlQueryable<VoterAffiliationStatisticsModel> {
    public Queryable() {
      super(VoterAffiliationStatisticsModel.class);
    }
  }
}
