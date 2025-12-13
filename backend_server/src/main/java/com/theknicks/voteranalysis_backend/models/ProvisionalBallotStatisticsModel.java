package com.theknicks.voteranalysis_backend.models;

import com.theknicks.voteranalysis_backend.annotations.AutoSql;
import com.theknicks.voteranalysis_backend.annotations.SqlColumnName;
import com.theknicks.voteranalysis_backend.helpers.AutoSqlQueryable;

/** This is the data necessary to cover the Provisional Ballots GUI use-cases. */
@AutoSql(
    collection = "app.eavs_data",
    joining = {"app.eavs_geounit"},
    joinMethod = {"inner"},
    joinOn = {"app.eavs_geounit.eavs_unit_code = app.eavs_data.region_id"})
public record ProvisionalBallotStatisticsModel(
    @SqlColumnName(name = "eavs_data.region_id", omitFromAggregate = true) String fullRegionId,
    @SqlColumnName(name = "eavs_geounit.name", omitFromAggregate = true) String countyName,
    @SqlColumnName(name = "prov_cast") int totalProvisionalBallotsCast,
    @SqlColumnName(name = "total_ballots_cast") int totalBallotsCast,
    @SqlColumnName(name = "prov_reason_not_in_roll") int ballotReasonNotOnList,
    @SqlColumnName(name = "prov_reason_no_id") int ballotReasonNoIdAvailable,
    @SqlColumnName(name = "prov_reason_not_eligibe_official") int ballotReasonChallengedByOfficial,
    @SqlColumnName(name = "prov_reason_challenged") int ballotReasonChallengedByOther,
    @SqlColumnName(name = "prov_reason_wrong_precinct") int ballotReasonWrongPrecinct,
    @SqlColumnName(name = "prov_reason_name_address") int ballotReasonNotUpdatedAddress,
    @SqlColumnName(name = "prov_reason_mail_ballot_unsurrendered") int ballotReasonDidNotSurrender,
    @SqlColumnName(name = "prov_reason_hours_extended") int ballotReasonExtendedVotingHours,
    @SqlColumnName(name = "prov_reason_same_day_reg") int ballotReasonSameDayRegistration,
    @SqlColumnName(name = "prov_other") int ballotReasonOther,
    @SqlColumnName(name = "prov_reject_total") int rejectedProvisionalBallots) {
  public ProvisionalBallotStatisticsModel(
      int totalProvisionalBallotsCast,
      int totalBallotsCast,
      int ballotReasonNotOnList,
      int ballotReasonNoIdAvailable,
      int ballotReasonChallengedByOfficial,
      int ballotReasonChallengedByOther,
      int ballotReasonWrongPrecinct,
      int ballotReasonNotUpdatedAddress,
      int ballotReasonDidNotSurrender,
      int ballotReasonExtendedVotingHours,
      int ballotReasonSameDayRegistration,
      int ballotReasonOther,
      int rejectedProvisionalBallots) {
    this(
        "0000000000",
        "Aggregated",
        totalProvisionalBallotsCast,
        totalBallotsCast,
        ballotReasonNotOnList,
        ballotReasonNoIdAvailable,
        ballotReasonChallengedByOfficial,
        ballotReasonChallengedByOther,
        ballotReasonWrongPrecinct,
        ballotReasonNotUpdatedAddress,
        ballotReasonDidNotSurrender,
        ballotReasonExtendedVotingHours,
        ballotReasonSameDayRegistration,
        ballotReasonOther,
        rejectedProvisionalBallots);
  }

  public static class Queryable extends AutoSqlQueryable<ProvisionalBallotStatisticsModel> {
    public Queryable() {
      super(ProvisionalBallotStatisticsModel.class);
    }
  }
}
