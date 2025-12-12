package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/** This is holds the data for GUI21, based off the view in the db. */
@AutoSql(view = "app.v_state_year_summary")
public record ViewStateYearSummaryModel(
    @SqlColumnName int stateFipsCode, // NOTE(jerry): unpadded. For some reason.
    @SqlColumnName String stateCode,
    @SqlColumnName String stateName,
    @SqlColumnName int forYear,
    @SqlColumnName int activeRegistered,
    @SqlColumnName int inactiveRegistered,
    @SqlColumnName int totalRegistered,
    @SqlColumnName int totalBallotsCast,
    @SqlColumnName int earlyVotingTotal,
    @SqlColumnName int ballotsByMail,
    @SqlColumnName int ballotsByDropbox,
    @SqlColumnName int totalProvisionalBallotsCast,
    @SqlColumnName double activeVoterRate,
    @SqlColumnName double inactiveVoterRate,
    @SqlColumnName double turnOutRate,
    @SqlColumnName double earlyVotingShareRate,
    @SqlColumnName double mailinBallotVotingShareRate,
    @SqlColumnName double dropboxBallotVotingShareRate) {
  public static class Queryable extends AutoSqlQueryable<ViewStateYearSummaryModel> {
    public Queryable() {
      super(ViewStateYearSummaryModel.class);
    }
  }
}
