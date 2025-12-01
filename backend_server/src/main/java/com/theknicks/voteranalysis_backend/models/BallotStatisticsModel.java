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
@AutoSql(
    collection = "app.eavs_data",
    joining = {"app.eavs_geounit"},
    joinMethod = {"inner"},
    joinOn = {"app.eavs_geounit.eavs_unit_code = app.eavs_data.region_id"})
public record BallotStatisticsModel(
    @SqlColumnName(name = "eavs_data.region_id", omitFromAggregate = true) String fullRegionId,
    @SqlColumnName(name = "eavs_geounit.name", omitFromAggregate = true) String regionName,
    @SqlColumnName(name = "ballots_dropbox") int dropboxBallots,
    @SqlColumnName(name = "ballots_by_mail") int totalBallotsByMail,
    @SqlColumnName(name = "total_ballots_cast") int totalBallotsCast) {
  public BallotStatisticsModel(int dropboxBallots, int totalBallotsByMail, int totalBallotsCast) {
    this("0000000000", "Aggregated", dropboxBallots, totalBallotsByMail, totalBallotsCast);
  }

  public static class Queryable extends AutoSqlQueryable<BallotStatisticsModel> {
    public Queryable() {
      super(BallotStatisticsModel.class);
    }
  }
}
