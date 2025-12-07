import { getCVAPStatisticsData, getVoterRegistrationCounts, type VoterRegistrationStatisticsModel, type CVAPStatisticsModel } from "../../../api/client";
import { CVAP_INFO_COLUMNS, bargraphDataForCVAPInfo } from "../dataColumns";
import { STATE_INFORMATION_VIEW_TYPE_SIMPLE, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_VIEW_CVAP_PERCENTAGE } from "./viewIds";

export default {
    [ID_SELECTION_VIEW_CVAP_PERCENTAGE]: {
        path: "cvap-registration",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "CVAP Composition",
            barGraphXTitle: "Race",
            dataColumnSet: CVAP_INFO_COLUMNS,
            barDataGenerator: bargraphDataForCVAPInfo,
            rowDataGenerators: [getCVAPStatisticsData, getVoterRegistrationCounts],
            ratioGenerator: (row: VoterRegistrationStatisticsModel & CVAPStatisticsModel) => [row.total!, row.cvapTotal!]
        }
    } as StateInformationViewDataConfiguration
}