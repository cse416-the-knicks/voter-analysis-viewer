import type { MailBallotRejectionStatisticsModel, PollbookDeletionStatisticsModel, ProvisionalBallotStatisticsModel, VoterRegistrationStatisticsModel } from "../../api/client";
import type { GridColDef } from '@mui/x-data-grid';
import { GRID_CHECKBOX_SELECTION_COL_DEF } from "@mui/x-data-grid";
import type { BarChartDataEntry } from "../DataDisplays/BarChart";

const PROVISIONAL_BALLOT_COLUMNS: GridColDef<ProvisionalBallotStatisticsModel[]>[] = [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    renderHeader: () => <></>, // hides the "Select All" checkbox
  },
  { field: 'countyName', headerName: 'County', width: 120 },
  { field: 'totalBallotsCast', headerName: 'Total Ballots Cast', type: 'number', width: 170 },
  { field: 'ballotReasonNotOnList', headerName: 'Not On List', type: 'number', width: 150 },
  { field: 'ballotReasonNoIdAvailable', headerName: 'No ID', type: 'number', width: 120 },
  { field: 'ballotReasonChallengedByOfficial', headerName: 'Challenged Official', type: 'number', width: 190 },
  { field: 'ballotReasonChallengedByOther', headerName: 'Challenged Other', type: 'number', width: 180 },
  { field: 'ballotReasonWrongPrecinct', headerName: 'Wrong Precinct', type: 'number', width: 170 },
  { field: 'ballotReasonNotUpdatedAddress', headerName: 'Not Updated Address', type: 'number', width: 200 },
  { field: 'ballotReasonDidNotSurrender', headerName: 'Did Not Surrender', type: 'number', width: 190 },
  { field: 'ballotReasonExtendedVotingHours', headerName: 'Extended Voter Hours', type: 'number', width: 200 },
  { field: 'balloReasonSameDayRegistration', headerName: 'Used SDR', type: 'number', width: 140 },
  { field: 'ballotReasonOther', headerName: 'Other', type: 'number', width: 120 },
];

const ACTIVE_VOTER_REGISTRATION_COLUMNS: GridColDef<VoterRegistrationStatisticsModel[]>[] = [
    {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    renderHeader: () => <></>, // This hides the "Select All" checkbox
  },
  { field: 'countyName', headerName: 'County', width: 120 },
  { field: 'total', headerName: 'Total Voters Registered', type: 'number', width: 200 },
  { field: 'active', headerName: 'Active Voters', type: 'number', width: 150 },
  { field: 'inactive', headerName: 'Inactive Voters', type: 'number', width: 150 },
];

const POLL_BOOK_DELETION_COLUMNS: GridColDef<PollbookDeletionStatisticsModel[]>[] = [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    renderHeader: () => <></>, // hides the "Select All" checkbox
  },
  { field: 'countyName', headerName: 'County', width: 120 },
  { field: 'totalRemoved', headerName: 'Total Removals', type: 'number', width: 150 },
  { field: 'removedReasonMoved', headerName: 'Moved', type: 'number', width: 120 },
  { field: 'removedReasonDeceased', headerName: 'Deceased', type: 'number', width: 130 },
  { field: 'removedReasonFelony', headerName: 'Felony', type: 'number', width: 120 },
  { field: 'removedReasonFailedToConfirm', headerName: 'Failed To Confirm', type: 'number', width: 180 },
  { field: 'removedReasonIncompetent', headerName: 'Incompetent', type: 'number', width: 150 },
  { field: 'removedReasonRequested', headerName: 'Requested', type: 'number', width: 150 },
  { field: 'removedReasonDuplicate', headerName: 'Duplicate', type: 'number', width: 150 },
  { field: 'removedOther', headerName: 'Other', type: 'number', width: 120 },
];

const MAIL_BALLOT_REJECTION_COLUMNS: GridColDef<MailBallotRejectionStatisticsModel[]>[] = [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    renderHeader: () => <></>, // hides the "Select All" checkbox
  },
  { field: 'countyName', headerName: 'County', width: 120 },
  { field: 'rejectTotal', headerName: 'Total Rejections', type: 'number', width: 150 },
  { field: 'rejectLate', headerName: 'Late', type: 'number', width: 100 },
  { field: 'rejectNoSignature', headerName: 'No Signature', type: 'number', width: 150 },
  { field: 'rejectNoWitnessSignature', headerName: 'No Witness Signature', type: 'number', width: 180 },
  { field: 'rejectSignatureMismatch', headerName: 'Signature Mismatch', type: 'number', width: 170 },
  { field: 'rejectUnofficialEnv', headerName: 'Unofficial Envelope', type: 'number', width: 170 },
  { field: 'rejectBallotMissing', headerName: 'Ballot Missing', type: 'number', width: 150 },
  { field: 'rejectNoSecrecyEnvironment', headerName: 'No Secrecy Envelope', type: 'number', width: 180 },
  { field: 'rejectMultipleInEnvironment', headerName: 'Multiple in Envelope', type: 'number', width: 180 },
  { field: 'rejectUnsealedEnvironment', headerName: 'Unsealed Envelope', type: 'number', width: 170 },
  { field: 'rejectNoPostMark', headerName: 'No Postmark', type: 'number', width: 140 },
  { field: 'rejectNoAddress', headerName: 'No Address', type: 'number', width: 140 },
  { field: 'rejectVoterDeceased', headerName: 'Voter Deceased', type: 'number', width: 160 },
  { field: 'rejectDuplicateVote', headerName: 'Duplicate Vote', type: 'number', width: 160 },
  { field: 'rejectMissingDocumentation', headerName: 'Missing Documentation', type: 'number', width: 200 },
  { field: 'rejectNotEligible', headerName: 'Not Eligible', type: 'number', width: 150 },
  { field: 'rejectNoApplication', headerName: 'No Application', type: 'number', width: 160 },
  { field: 'rejectOther', headerName: 'Other', type: 'number', width: 120 },
];

function bargraphDataForProvisionalBallots(aggregatedStatistics: ProvisionalBallotStatisticsModel): BarChartDataEntry[] {
  return ([
    {category: "Total Ballots", value: aggregatedStatistics.totalBallotsCast || 0},
    {category: "Not On List", value: aggregatedStatistics.ballotReasonNotOnList || 0},
    {category: "No ID", value: aggregatedStatistics.ballotReasonNoIdAvailable || 0},
    {category: "Challenged Official", value: aggregatedStatistics.ballotReasonChallengedByOfficial || 0},
    {category: "Challenged Other", value: aggregatedStatistics.ballotReasonChallengedByOther || 0},
    {category: "Wrong Precinct", value: aggregatedStatistics.ballotReasonWrongPrecinct || 0},
    {category: "Not Updated Address", value: aggregatedStatistics.ballotReasonNotUpdatedAddress || 0},
    {category: "Did Not Surrender", value: aggregatedStatistics.ballotReasonDidNotSurrender || 0},
    {category: "Extended Voter Hours", value: aggregatedStatistics.ballotReasonExtendedVotingHours || 0},
    {category: "Used SDR", value: aggregatedStatistics.ballotReasonSameDayRegistration || 0},
    {category: "Other", value: aggregatedStatistics.ballotReasonOther || 0},
  ]);
}

function bargraphDataForMailBallotRejections(aggregatedStatistics: MailBallotRejectionStatisticsModel): BarChartDataEntry[] {
  return ([
    { category: "Total", value: aggregatedStatistics.rejectTotal || 0 },
    { category: "Late", value: aggregatedStatistics.rejectLate || 0 },
    { category: "No Signature", value: aggregatedStatistics.rejectNoSignature || 0 },
    { category: "No Witness Signature", value: aggregatedStatistics.rejectNoWitnessSignature || 0 },
    { category: "Signature Mismatch", value: aggregatedStatistics.rejectSignatureMismatch || 0 },
    { category: "Unofficial Envelope", value: aggregatedStatistics.rejectUnofficialEnv || 0},
    { category: "Ballot Missing", value: aggregatedStatistics.rejectBallotMissing || 0 },
    { category: "No Secrecy Envelope", value: aggregatedStatistics.rejectNoSecrecyEnvironment || 0 },
    { category: "Multiple in Envelope", value: aggregatedStatistics.rejectMultipleInEnvironment || 0 },
    { category: "Unsealed Envelope", value: aggregatedStatistics.rejectUnsealedEnvironment || 0 },
    { category: "No Postmark", value: aggregatedStatistics.rejectNoPostMark || 0},
    { category: "No Address", value: aggregatedStatistics.rejectNoAddress || 0 },
    { category: "Voter Deceased", value: aggregatedStatistics.rejectVoterDeceased || 0 },
    { category: "Duplicate Vote", value: aggregatedStatistics.rejectDuplicateVote || 0 },
    { category: "Missing Documentation", value: aggregatedStatistics.rejectMissingDocumentation || 0 },
    { category: "Not Eligible", value: aggregatedStatistics.rejectNotEligible || 0 },
    { category: "No Application", value: aggregatedStatistics.rejectNoApplication || 0 },
    { category: "Other", value: aggregatedStatistics.rejectOther || 0},
  ]);
}

function bargraphDataForPollBookDeletions(aggregatedStatistics: PollbookDeletionStatisticsModel): BarChartDataEntry[] {
  return ([
    {category: "Total", value: aggregatedStatistics.totalRemoved || 0},
    {category: "Moved", value: aggregatedStatistics.removedReasonMoved || 0},
    {category: "Deceased", value: aggregatedStatistics.removedReasonDeceased || 0},
    {category: "Felony", value: aggregatedStatistics.removedReasonFelony || 0},
    {category: "Failed to Confirm", value: aggregatedStatistics.removedReasonFailedToConfirm || 0},
    {category: "Incompetent", value: aggregatedStatistics.removedReasonIncompetent || 0},
    {category: "Requested", value: aggregatedStatistics.removedReasonRequested || 0},
    {category: "Duplicate", value: aggregatedStatistics.removedReasonDuplicate || 0},
    {category: "Other", value: aggregatedStatistics.removedOther || 0}
  ]);
}

function bargraphDataForActiveVoterRegistrations(aggregatedStatistics: VoterRegistrationStatisticsModel): BarChartDataEntry[] {
  return ([
    {category: "Total Voters", value: aggregatedStatistics.total || 0},
    {category: "Active Voters", value: aggregatedStatistics.active || 0},
    {category: "Inactive Voters", value: aggregatedStatistics.inactive || 0},
  ]);
}

export {
  PROVISIONAL_BALLOT_COLUMNS,
  MAIL_BALLOT_REJECTION_COLUMNS,
  POLL_BOOK_DELETION_COLUMNS,
  ACTIVE_VOTER_REGISTRATION_COLUMNS,
  bargraphDataForProvisionalBallots,
  bargraphDataForMailBallotRejections,
  bargraphDataForPollBookDeletions,
  bargraphDataForActiveVoterRegistrations,
};