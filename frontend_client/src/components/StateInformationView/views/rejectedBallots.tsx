import { BubbleChart } from "@mui/icons-material";
import { getElectionResultsSummary, getDetailedVotingEquipmentUsage, getMailBallotRejections } from "../../../api/client";
import { STATE_INFORMATION_VIEW_TYPE_OVERLAY, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_REJECTED_BALLOTS } from "./viewIds";

export default {
    [ID_SELECTION_REJECTED_BALLOTS]: {
        path: "rejected-ballots-chart",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
            element: (fipsCode, overlayWidth, overlayHeight) => <BubbleChart
                data={async () => {
                    const electionResultsData = await getElectionResultsSummary(fipsCode!, 2024);
                    const equipmentQuality = await getDetailedVotingEquipmentUsage(fipsCode!);
                    const rejectionData = await getMailBallotRejections(fipsCode!);
                    const mergedData = equipmentQuality.map((e, i) => ({ ...e, ...rejectionData[i], ...electionResultsData[i] }));

                    const republicanBubbleColor = "#d73027";
                    const democraticBubbleColor = "#4575b4";

                    return mergedData.map((data) => ({
                        x: data.averageQualityScore!,
                        y: (data.rejectTotal! / data.totalBallotsCast!) * 100.0 || 0,
                        name: data.countyName!,
                        size: 10,
                        party: data.republicanVotes! > data.democratVotes! ? "Rep" : "Dem",
                        color: data.republicanVotes! > data.democratVotes! ? republicanBubbleColor : democraticBubbleColor,
                    }));
                }}
                width={overlayWidth}
                height={overlayHeight}
                title="Voting Equipment Quality"
                xAxisLabel="Quality Level"
                yAxisLabel="Rejected Ballots (%)"
                useRegression
            />
        }
    } as StateInformationViewDataConfiguration
}