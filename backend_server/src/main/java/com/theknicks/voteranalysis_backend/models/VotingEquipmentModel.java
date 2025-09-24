package com.theknicks.voteranalysis_backend.models;

import java.util.Optional;

/**
 * Voting Equipment Model Response
 *
 * For simplicity, this model is going to be almost directly
 * in sync with the spreadsheet columns.
 *
 * NOTE(jerry):
 * For the scope of this, I have no strong feelings about typing,
 * and I think it's basically fine to keep it all as strings.
 *
 * NOTE/TODO(jerry): This should probably be auto-generated, I think we could
 * auto generate it to be honest.
 *
 * I might do this in another PR.
 */
public record VotingEquipmentModel(
        String manufacturer,
        // No strong opinions, but this could be an enum.
        String equipmentType,
        String modelName,
        // Could/Should be dates, can change later.
        Optional<String> firstManufactured,
        Optional<String> lastManufactured,
        Optional<String> operatingSystem,
        Optional<String> firmwareVersion,
        // Voter Verified Paper Audit Trail
        Optional<String> vvpat,
        // Mostly VVSG
        Optional<String> certificationLevel,
        Optional<String> securityRiskDescription
) {
}
