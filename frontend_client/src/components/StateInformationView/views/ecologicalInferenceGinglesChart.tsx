import useCssCalc from "../../../hooks/useCssCalc";
import DisplayEIGinglesChart from "../../DisplayEIGinglesChart";
import { STATE_INFORMATION_VIEW_TYPE_OVERLAY, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_GINGLES_CHART } from "./viewIds";

export default {
  [ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_GINGLES_CHART]: {
    path: "ei-gingles-chart",
    description: {
      type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
      element: (fipsCode, overlayWidth, overlayHeight) => <DisplayEIGinglesChart fipsCode={fipsCode} width={useCssCalc("83.5vw")} height={overlayHeight} />,
    },
  } as StateInformationViewDataConfiguration,
};
