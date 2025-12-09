import FullScreenDetailedVoterRegistrationTable from "../../FullScreenDetailedVoterRegistrationTable";
import { STATE_INFORMATION_VIEW_TYPE_OVERLAY, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE } from "./viewIds";

export default {
  [ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE]: {
    path: "voter-table",
    matcher: "voter-table/:countyCode?",
    description: {
      type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
      element: (_fipsCode, overlayWidth, overlayHeight) => (
        <FullScreenDetailedVoterRegistrationTable pageSize={15} width={overlayWidth} height={overlayHeight * 0.9} />
      ),
    },
  } as StateInformationViewDataConfiguration,
};
