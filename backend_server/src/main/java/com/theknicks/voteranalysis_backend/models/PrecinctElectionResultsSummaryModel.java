package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/** See PrecinctCVAPStatisticsModel.java for the reasoning of this record definition. */
@AutoSql(
    collection = "election_results",
    joining = "app.eavs_geounit",
    joinMethod = {"inner"},
    joinOn = {"app.eavs_geounit.eavs_unit_code = app.election_results.region_id"})
public record PrecinctElectionResultsSummaryModel(
    @SqlColumnName(name = "election_results.region_id", omitFromAggregate = true)
        String fullRegionId,
    @SqlColumnName(name = "eavs_geounit.name", omitFromAggregate = true) String regionName,
    @SqlColumnName(name = "rep_votes") int republicanVotes,
    @SqlColumnName(name = "dem_votes") int democratVotes,
    @SqlColumnName(name = "other_votes") int otherVotes,
    @SqlColumnName(name = "total_votes") int totalVotes) {
  public ElectionResultsSummaryModel toElectionResultsSummaryModel() {
    return new ElectionResultsSummaryModel(
        fullRegionId(),
        "Precinct " + fullRegionId().substring(5),
        republicanVotes(),
        democratVotes(),
        otherVotes(),
        totalVotes());
  }

  public static class Queryable extends AutoSqlQueryable<PrecinctElectionResultsSummaryModel> {
    public Queryable() {
      super(PrecinctElectionResultsSummaryModel.class);
    }
  }
}
