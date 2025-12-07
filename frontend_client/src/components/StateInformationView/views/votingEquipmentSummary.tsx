import VotingMachineSummaryTable from "../../VotingEquipmentSummaryTable";
import { STATE_INFORMATION_VIEW_TYPE_OVERLAY, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_VOTING_EQUIPMENT_SUMMARY } from "./viewIds";

export default {
    [ID_SELECTION_VOTING_EQUIPMENT_SUMMARY]: {
        path: "equipment-summary",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
            element: (fipsCode, overlayWidth, overlayHeight) => <VotingMachineSummaryTable
                width={overlayWidth}
                height={overlayHeight}
                fipsCode={fipsCode}
            />
        }
    } as StateInformationViewDataConfiguration
}