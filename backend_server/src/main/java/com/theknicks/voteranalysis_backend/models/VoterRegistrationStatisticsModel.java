package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/** This is the data required to fulfill use-case 7, the voter registration count. A1a/b/c */
@AutoSql(
    collection = "app.eavs_data",
    joining = {"app.eavs_geounit"},
    joinMethod = {"inner"},
    joinOn = {"app.eavs_geounit.eavs_unit_code = app.eavs_data.region_id"})
public record VoterRegistrationStatisticsModel(
    @SqlColumnName(name = "eavs_data.region_id", omitFromAggregate = true) String fullRegionId,
    @SqlColumnName(name = "eavs_geounit.name", omitFromAggregate = true) String countyName,
    @SqlColumnName(name = "total_registered") int total,
    @SqlColumnName(name = "active_registered") int active,
    @SqlColumnName(name = "inactive_registered") int inactive) {
  public VoterRegistrationStatisticsModel(int total, int active, int inactive) {
    this("0000000000", "Aggregated", total, active, inactive);
  }

  public static class Queryable extends AutoSqlQueryable<VoterRegistrationStatisticsModel> {
    public Queryable() {
      super(VoterRegistrationStatisticsModel.class);
    }
  }
}
