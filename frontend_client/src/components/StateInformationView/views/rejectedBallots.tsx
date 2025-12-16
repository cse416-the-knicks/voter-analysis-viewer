import {
  getElectionResultsSummary,
  getDetailedVotingEquipmentUsage,
  getMailBallotRejections,
  getVoterRegistrationCounts,
  getProvisionalBallots,
} from "../../../api/client";
import BubbleChart from "../../DataDisplays/BubbleChart";
import { DETAIL_STATE_TYPE_DEMOCRAT, DETAIL_STATE_TYPE_REPUBLICAN, getDetailStateType } from "../../FullBoundedUSMap/detailedStatesInfo";
import { STATE_INFORMATION_VIEW_TYPE_OVERLAY, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_REJECTED_BALLOTS } from "./viewIds";

export default {
  [ID_SELECTION_REJECTED_BALLOTS]: {
    path: "rejected-ballots-chart",
    description: {
      type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
      element: (fipsCode, overlayWidth, overlayHeight) => (
        <BubbleChart
          data={async () => {
            const electionResultsData = await getElectionResultsSummary(fipsCode!, 2024);
            const equipmentQuality = await getDetailedVotingEquipmentUsage(fipsCode!);

            if (!equipmentQuality.some((e) => e.averageAge! > 0 && e.averageQualityScore! > 0)) {
              return [];
            }

            const rejectionData = await getMailBallotRejections(fipsCode!);
            const provisionalBallotsData = await getProvisionalBallots(fipsCode!);
            const mergedData = equipmentQuality.map((e, i) => ({ ...e, ...rejectionData[i], ...electionResultsData[i], ...provisionalBallotsData[i] }));

            const republicanBubbleColor = "#d73027";
            const democraticBubbleColor = "#4575b4";
            const neutralBubbleColor = "purple";

            const voterData = await getVoterRegistrationCounts(fipsCode!);
            const maxVoters = Math.max(...voterData.map((x) => x.total!));

            const stateType = getDetailStateType(fipsCode);
            const political = stateType.some((x) => x === DETAIL_STATE_TYPE_DEMOCRAT || x === DETAIL_STATE_TYPE_REPUBLICAN);

            return mergedData.map((data, i) => ({
              x: data.averageQualityScore!,
              y: ((data.rejectTotal! + data.rejectedProvisionalBallots!) / data.totalBallotsCast!) * 100.0 || 0,
              name: data.countyName!,
              size: Math.max((voterData[i].total! / maxVoters) * 40, 5),
              party: political ? (data.republicanVotes! > data.democratVotes! ? "Rep" : "Dem") : "NONE",
              color: political ? (data.republicanVotes! > data.democratVotes! ? republicanBubbleColor : democraticBubbleColor) : neutralBubbleColor,
            }));
          }}
          maxXScale={1}
          width={overlayWidth}
          height={overlayHeight}
          title="Voting Equipment Quality"
          xAxisLabel="Quality Level"
          yAxisLabel="Rejected Ballots (%)"
          degree={3}
          useRegression
        />
      ),
    },
  } as StateInformationViewDataConfiguration,
};
