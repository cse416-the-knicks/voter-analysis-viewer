import type { GridColDef } from "@mui/x-data-grid";
import type { ProvisionalBallotStatisticsModel, PollbookDeletionStatisticsModel, MailBallotRejectionStatisticsModel, VoterRegistrationStatisticsModel, VotingEquipmentUsageStatisticsModel, ElectionResultsSummaryModel, VoterAffiliationStatisticsModel } from "../../api/client";
import type { BarChartDataEntry } from "../DataDisplays/BarChart";

type DataFact =
  | ProvisionalBallotStatisticsModel
  | PollbookDeletionStatisticsModel
  | MailBallotRejectionStatisticsModel
  | VoterRegistrationStatisticsModel
  | VotingEquipmentUsageStatisticsModel
  | ElectionResultsSummaryModel
  | VoterAffiliationStatisticsModel;

const STATE_INFORMATION_VIEW_TYPE_SIMPLE = "SIMPLE";
const STATE_INFORMATION_VIEW_TYPE_OVERLAY = "OVERLAY";

interface StateInformationViewOverlayView {
    type: typeof STATE_INFORMATION_VIEW_TYPE_OVERLAY;
    element?: (fipsCode: string, overlayWidth: number, overlayHeight: number) => React.ReactNode;
}
interface StateInformationViewSimpleFactView {
    type: typeof STATE_INFORMATION_VIEW_TYPE_SIMPLE;
    barGraphTitle: string;
    barGraphXTitle: string;
    dataColumnSet: GridColDef<DataFact[]>[];
    barDataGenerator: (data: DataFact) => BarChartDataEntry[];

    // NOTE: arg0 is for CVAP information, where the argument specifies
    // the demographic we want to target.
    ratioGenerator: ((row: DataFact, arg0: number) => number[]) | ((row: DataFact) => number[]);
    rowDataGenerators: ((fipsCode: string, params: object) => Promise<DataFact[]>)[];
}

interface StateInformationViewDataConfiguration {
    path: string;
    matcher?: string;
    description: StateInformationViewOverlayView | StateInformationViewSimpleFactView;
}

export type {
    StateInformationViewDataConfiguration,
    StateInformationViewSimpleFactView,
    StateInformationViewOverlayView,
    DataFact,
}

export {
    STATE_INFORMATION_VIEW_TYPE_OVERLAY,
    STATE_INFORMATION_VIEW_TYPE_SIMPLE,
}