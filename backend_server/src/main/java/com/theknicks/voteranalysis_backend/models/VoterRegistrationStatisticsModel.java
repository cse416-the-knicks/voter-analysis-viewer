package com.theknicks.voteranalysis_backend.models;

/**
 * This is the data required to fulfill use-case 7,
 * the voter registration count.
 * A1a/b/c
 */
public record VoterRegistrationStatisticsModel(
        String fullRegionId,
        String countyName,
        int total,
        int active,
        int inactive
) {
}
