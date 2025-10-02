package com.theknicks.voteranalysis_backend.models;

/**
 * This is the data necessary to cover the Provisional Ballots GUI
 * use-cases.
 */
public record ProvisionalBallotStatisticsModel(
        String fullRegionId,
        String countyName,
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
        int ballotReasonOther
) {
}
