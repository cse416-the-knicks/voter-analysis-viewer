import { getVoterAffiliations, type VoterAffiliationStatisticsModel } from "../../../api/client";
import { VOTER_AFFILIATION_COLUMNS, bargraphDataForVoterAffiliations } from "../dataColumns";
import { STATE_INFORMATION_VIEW_TYPE_SIMPLE, type StateInformationViewDataConfiguration } from "../dataViewModeConfig";
import { ID_SELECTION_VOTER_REGISTRATION } from "./viewIds";

export default {
    [ID_SELECTION_VOTER_REGISTRATION]: {
        path: "voter-registration",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "Voter Affiliation Count",
            barGraphXTitle: "Voter Party",
            dataColumnSet: VOTER_AFFILIATION_COLUMNS,
            barDataGenerator: bargraphDataForVoterAffiliations,
            rowDataGenerators: [getVoterAffiliations],
            ratioGenerator: (row: VoterAffiliationStatisticsModel) => [row.activeRegisteredVotersTotal!, row.registeredVotersTotal!]
        }
    } as StateInformationViewDataConfiguration
}
