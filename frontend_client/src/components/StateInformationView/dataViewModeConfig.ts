import type { GridColDef } from "@mui/x-data-grid";
import type { ElectionResultsSummaryModel, MailBallotRejectionStatisticsModel, PollbookDeletionStatisticsModel, ProvisionalBallotStatisticsModel, VoterAffiliationStatisticsModel, VoterRegistrationStatisticsModel, VotingEquipmentUsageStatisticsModel } from "../../api/client";
import type { BarChartDataEntry } from "../DataDisplays/BarChart";
import { ACTIVE_VOTER_REGISTRATION_COLUMNS, CVAP_INFO_COLUMNS, MAIL_BALLOT_REJECTION_COLUMNS, PROVISIONAL_BALLOT_COLUMNS, VOTER_AFFILIATION_COLUMNS, VOTING_EQUIPMENT_COLUMNS } from "./dataColumns";

type DataFact =
  | ProvisionalBallotStatisticsModel
  | PollbookDeletionStatisticsModel
  | MailBallotRejectionStatisticsModel
  | VoterRegistrationStatisticsModel
  | VotingEquipmentUsageStatisticsModel
  | ElectionResultsSummaryModel
  | VoterAffiliationStatisticsModel;

const ID_SELECTION_PROVISIONAL_BALLOT = 0;
const ID_SELECTION_ACTIVE_VOTERS = 1;
const ID_SELECTION_POLLBOOK_DELETION = 2;
const ID_SELECTION_MAIL_BALLOT_REJECTIONS = 3;
const ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES = 10;

const ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE = 4;
const ID_SELECTION_VOTING_EQUIPMENT_BY_AGE = 5;
const ID_SELECTION_VOTING_EQUIPMENT_SUMMARY = 16;

const ID_SELECTION_REJECTED_BALLOTS = 6;
const ID_SELECTION_MAIL_IN_VOTING = 7;

const ID_SELECTION_VOTER_REGISTRATION = 8;
const ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE = 9;
const ID_SELECTION_VIEW_CVAP_INFO = 11;
const ID_SELECTION_VIEW_CVAP_PERCENTAGE = 12;

const ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_GINGLES_CHART = 13;
const ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_VOTING_EQUIPMENT = 14;
const ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_REJECTED_BALLOTS = 15;

type StateInformationViewType = "SIMPLE" | "OVERLAY";
const STATE_INFORMATION_VIEW_TYPE_SIMPLE = "SIMPLE";
const STATE_INFORMATION_VIEW_TYPE_OVERLAY = "OVERLAY";

interface StateInformationViewOverlayView {
    type: typeof STATE_INFORMATION_VIEW_TYPE_OVERLAY;
    // element: React.ReactNode;
}
interface StateInformationViewSimpleFactView {
    type: typeof STATE_INFORMATION_VIEW_TYPE_SIMPLE;
    barGraphTitle: string;
    barGraphXTitle: string;
    dataColumnSet: GridColDef<DataFact[]>[];

    // barDataGenerator: (fipsCode: string) => BarChartDataEntry[];
    // rowDataGenerator: (fipsCode: string) => DataFact[];
}

interface StateInformationViewDataConfiguration {
    path: string;
    description: StateInformationViewOverlayView | StateInformationViewSimpleFactView;
    // TODO: allow choropleth configuration here.
}

//TODO: allow registration from outside of this file?

const FACT_VIEW_CONFIGURATIONS: Record<number, StateInformationViewDataConfiguration> = {
    [ID_SELECTION_PROVISIONAL_BALLOT]: {
        path: "provisional-ballots",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "Provisional Ballots",
            barGraphXTitle: "Ballots Cast",
            dataColumnSet: PROVISIONAL_BALLOT_COLUMNS,
        }
    },
    [ID_SELECTION_MAIL_BALLOT_REJECTIONS]: {
        path: "mail-ballot-rejections",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "Mail Ballots Rejection",
            barGraphXTitle: "Rejection Reasons",
            dataColumnSet: MAIL_BALLOT_REJECTION_COLUMNS,
        }
    },
    [ID_SELECTION_ACTIVE_VOTERS]: {
        path: "active-voters",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "Voter Registration Count",
            barGraphXTitle: "Voter Categories",
            dataColumnSet: ACTIVE_VOTER_REGISTRATION_COLUMNS,
        }
    },
    [ID_SELECTION_POLLBOOK_DELETION]: {
        path: "pollbook-deletions",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "Poll Book Deletions",
            barGraphXTitle: "Deletion Reasons",
            dataColumnSet: ACTIVE_VOTER_REGISTRATION_COLUMNS,
        }
    },
    [ID_SELECTION_VOTER_REGISTRATION]: {
        path: "voter-registration",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "Voter Affiliation Count",
            barGraphXTitle: "Voter Party",
            dataColumnSet: VOTER_AFFILIATION_COLUMNS,
        }
    },
    [ID_SELECTION_VIEW_CVAP_INFO]: {
        path: "cvap",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "CVAP Composition",
            barGraphXTitle: "Race",
            dataColumnSet: CVAP_INFO_COLUMNS,
        }
    },
    [ID_SELECTION_VIEW_CVAP_PERCENTAGE]: {
        path: "cvap-registration",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "CVAP Composition",
            barGraphXTitle: "Race",
            dataColumnSet: CVAP_INFO_COLUMNS,
        }
    },
    [ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES]: {
        path: "compare-voter-registration-rates",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
        }
    },
    [ID_SELECTION_REJECTED_BALLOTS]: {
        path: "rejected-ballots-chart",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
        }
    },
    [ID_SELECTION_MAIL_IN_VOTING]: {
        path: "mail-in-chart",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
        }
    },
    [ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE]: {
        path: "voter-table",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
        }
    },
    [ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE]: {
        path: "equipment-by-type",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "Voting Equipment Type Count",
            barGraphXTitle: "Equipment Type",
            dataColumnSet: VOTING_EQUIPMENT_COLUMNS,
        }
    },
    [ID_SELECTION_VOTING_EQUIPMENT_BY_AGE]: {
        path: "equipment-by-age",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "Voting Equipment Type Count",
            barGraphXTitle: "Equipment Type",
            dataColumnSet: VOTING_EQUIPMENT_COLUMNS,
        }
    },
    [ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_GINGLES_CHART]: {
        path: "ei-gingles-chart",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
        }
    },
    [ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_REJECTED_BALLOTS]: {
        path: "ei-rejected-ballots",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
        }
    },
    [ID_SELECTION_VOTING_EQUIPMENT_SUMMARY]: {
        path: "equipment-summary",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_OVERLAY,
        }
    },
}

export {
    ID_SELECTION_PROVISIONAL_BALLOT,
    ID_SELECTION_ACTIVE_VOTERS,
    ID_SELECTION_POLLBOOK_DELETION,
    ID_SELECTION_MAIL_BALLOT_REJECTIONS,
    ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES,
    ID_SELECTION_VOTING_EQUIPMENT_BY_AGE,
    ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE,
    ID_SELECTION_VOTING_EQUIPMENT_SUMMARY,
    ID_SELECTION_REJECTED_BALLOTS,
    ID_SELECTION_MAIL_IN_VOTING,
    ID_SELECTION_VOTER_REGISTRATION,
    ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE,
    ID_SELECTION_VIEW_CVAP_INFO,
    ID_SELECTION_VIEW_CVAP_PERCENTAGE,
    ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_GINGLES_CHART,
    ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_REJECTED_BALLOTS,
    ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_VOTING_EQUIPMENT,
    STATE_INFORMATION_VIEW_TYPE_OVERLAY,
    STATE_INFORMATION_VIEW_TYPE_SIMPLE,
    FACT_VIEW_CONFIGURATIONS,
}