package com.theknicks.voteranalysis_backend.models;

/*
 This is the data required to fulfill
 GUI.17, and is a custom aggregation without SQL.
*/
public record VoterAffiliationStatisticsModel(
        String fullRegionId,
        String countyName,
        int democraticTotal,
        int republicanTotal,
        int unaffiliatedTotal,
        int totalRegisteredVoters
) {
}
