package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/**
 * This holds C8a + C3a
 *
 * <p>TODO(jerry): how to determine which was the leading party for the unit? Don't recall if we
 * have schema for this.
 */
@AutoSql(collection = "app.eavs_data")
public record BallotStatisticsModel(
    @SqlColumnName(name = "region_id", omitFromAggregate = true) String fullRegionId,
    String regionName,
    @SqlColumnName(name = "ballots_dropbox") int dropboxBallots,
    @SqlColumnName(name = "total_ballots_cast") int totalBallotsCast) {
  public static class Queryable extends AutoSqlQueryable<BallotStatisticsModel> {
    public Queryable() {
      super(BallotStatisticsModel.class);
    }
  }
}
