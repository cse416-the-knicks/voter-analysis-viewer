import DisplayEIVotingEquipment from "../../DisplayEIVotingEquipment";
import { STATE_INFORMATION_VIEW_TYPE_OVERLAY, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_VOTING_EQUIPMENT } from "./viewIds";

export default {
    [ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_VOTING_EQUIPMENT]: {
        path: "ei-voting-equipment",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
            element: (fipsCode, overlayWidth, overlayHeight) => <DisplayEIVotingEquipment />
        }
    } as StateInformationViewDataConfiguration
}