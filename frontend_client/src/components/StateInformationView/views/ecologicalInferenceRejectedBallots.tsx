import DisplayEIRejectedBallots from "../../DisplayEIRejectedBallots";
import { STATE_INFORMATION_VIEW_TYPE_OVERLAY, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_REJECTED_BALLOTS } from "./viewIds";

export default {
  [ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_REJECTED_BALLOTS]: {
    path: "ei-rejected-ballots",
    description: {
      type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
      element: (fipsCode, overlayWidth, overlayHeight) => <DisplayEIRejectedBallots fipsCode={fipsCode} width={overlayWidth} height={overlayHeight} />,
    },
  } as StateInformationViewDataConfiguration,
};
