import { getElectionResultsSummary, getBallotStatistics, getCVAPStatisticsData } from "../../../api/client";
import BubbleChart from "../../DataDisplays/BubbleChart";
import { STATE_INFORMATION_VIEW_TYPE_OVERLAY, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_MAIL_IN_VOTING } from "./viewIds";

export default {
  [ID_SELECTION_MAIL_IN_VOTING]: {
    path: "mail-in-chart",
    description: {
      type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
      element: (fipsCode, overlayWidth, overlayHeight) => (
        <BubbleChart
          data={async () => {
            const electionResultsData = await getElectionResultsSummary(fipsCode!, 2024);
            const ballotStatisticsData = await getBallotStatistics(fipsCode!);
            const mergedData = electionResultsData.map((e, i) => ({ ...e, ...ballotStatisticsData[i] }));

            const republicanBubbleColor = "#d73027";
            const democraticBubbleColor = "#4575b4";

            const cvapData = await getCVAPStatisticsData(fipsCode!);
            const maxCvap = Math.max(...cvapData.map((x) => x.cvapTotal!));

            return mergedData.map((data, i) => ({
              x: (data.republicanVotes! / data.totalVotes!) * 100.0,
              y: (data.totalBallotsByMail! / data.totalBallotsCast!) * 100.0,
              name: data.regionName!,
              size: Math.max((cvapData[i].cvapTotal! / maxCvap) * 40, 5),
              party: "NONE",
              color: data.republicanVotes! > data.democratVotes! ? republicanBubbleColor : democraticBubbleColor,
            }));
          }}
          width={overlayWidth}
          height={overlayHeight}
          maxXScale={100}
          title="Mail Ballots by Party"
          xAxisLabel="Republican Votes (%)"
          yAxisLabel="Mail Ballot Voting (%)"
        />
      ),
    },
  } as StateInformationViewDataConfiguration,
};
