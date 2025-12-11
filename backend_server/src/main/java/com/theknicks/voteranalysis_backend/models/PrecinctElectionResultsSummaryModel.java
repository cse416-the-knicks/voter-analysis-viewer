package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/** See PrecinctCVAPStatisticsModel.java for the reasoning of this record definition. */
@AutoSql(collection = "election_results")
public record PrecinctElectionResultsSummaryModel(
    @SqlColumnName(name = "region_id", cond = "SUBSTRING(region_id, 6, 1) = '-'")
        String fullRegionId,
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
