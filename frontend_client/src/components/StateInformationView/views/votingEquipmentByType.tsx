import { getDetailedVotingEquipmentUsage, type VotingEquipmentUsageStatisticsModel } from "../../../api/client";
import { VOTING_EQUIPMENT_COLUMNS, bargraphDataForVotingEquipmentUsages } from "../dataColumns";
import { STATE_INFORMATION_VIEW_TYPE_SIMPLE, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE } from "./viewIds";

export default {
    [ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE]: {
        path: "equipment-by-type",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "Voting Equipment Type Count",
            barGraphXTitle: "Equipment Type",
            dataColumnSet: VOTING_EQUIPMENT_COLUMNS,
            barDataGenerator: bargraphDataForVotingEquipmentUsages,
            rowDataGenerators: [getDetailedVotingEquipmentUsage],
            ratioGenerator: (row: VotingEquipmentUsageStatisticsModel) => [0, 0]
        }
    } as StateInformationViewDataConfiguration
}