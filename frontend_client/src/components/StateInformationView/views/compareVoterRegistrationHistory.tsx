import { getVoterRegistrationHistory } from "../../../api/client";
import useCssCalc from "../../../hooks/useCssCalc";
import LineChart from "../../DataDisplays/LineChart";
import { STATE_INFORMATION_VIEW_TYPE_OVERLAY, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES } from "./viewIds";

export default {
  [ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES]: {
    path: "compare-voter-registration-rates",
    description: {
      type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
      element: (fipsCode, overlayWidth, overlayHeight) => (
        <LineChart
          //@ts-expect-error : Error expected, orval likes generating "optional" types even though they are actually identical.
          data={async () => {
            const votingHistory = await getVoterRegistrationHistory(fipsCode!, { years: [2016, 2020, 2024] });
            const eavsColors = ["red", "blue", "green", "magenta", "black"];
            // Manually assign back colors on the frontend.
            return votingHistory.map((x, i) => ({ color: eavsColors[i], ...x }));
          }}
          width={overlayWidth - useCssCalc("1.5vw")}
          height={overlayHeight}
          title="Voter Registration By Year"
          xAxisLabel="EAVs Unit"
          yAxisLabel="Registered Voters"
        />
      ),
    },
  } as StateInformationViewDataConfiguration,
};
