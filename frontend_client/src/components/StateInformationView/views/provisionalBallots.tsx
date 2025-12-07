import { getProvisionalBallots, type ProvisionalBallotStatisticsModel } from "../../../api/client";
import { PROVISIONAL_BALLOT_COLUMNS, bargraphDataForProvisionalBallots } from "../dataColumns";
import { STATE_INFORMATION_VIEW_TYPE_SIMPLE, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_PROVISIONAL_BALLOT } from "./viewIds";

export default {
    [ID_SELECTION_PROVISIONAL_BALLOT]: {
        path: "provisional-ballots",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "Provisional Ballots",
            barGraphXTitle: "Ballots Cast",
            dataColumnSet: PROVISIONAL_BALLOT_COLUMNS,
            barDataGenerator: bargraphDataForProvisionalBallots,
            rowDataGenerators: [getProvisionalBallots],
            ratioGenerator: (row: ProvisionalBallotStatisticsModel) => [row.totalProvisionalBallotsCast!, row.totalBallotsCast!]
        }
    } as StateInformationViewDataConfiguration
}