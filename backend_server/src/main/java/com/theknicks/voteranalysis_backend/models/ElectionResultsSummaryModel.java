package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/** This holds the information about a federal election year. */
@AutoSql(
    collection = "election_results",
    joining = "app.eavs_geounit",
    joinMethod = {"inner"},
    joinOn = {"app.eavs_geounit.eavs_unit_code = app.election_results.region_id"})
public record ElectionResultsSummaryModel(
    @SqlColumnName(name = "election_results.region_id", omitFromAggregate = true)
        String fullRegionId,
    @SqlColumnName(name = "eavs_geounit.name", omitFromAggregate = true) String regionName,
    @SqlColumnName(name = "rep_votes") int republicanVotes,
    @SqlColumnName(name = "dem_votes") int democratVotes,
    @SqlColumnName(name = "other_votes") int otherVotes,
    @SqlColumnName(name = "total_votes") int totalVotes) {
  public ElectionResultsSummaryModel(
      int republicanVotes, int democratVotes, int otherVotes, int totalVotes) {
    this("0000000000", "Aggregated", republicanVotes, democratVotes, otherVotes, totalVotes);
  }

  public static class Queryable extends AutoSqlQueryable<ElectionResultsSummaryModel> {
    public Queryable() {
      super(ElectionResultsSummaryModel.class);
    }
  }
}
