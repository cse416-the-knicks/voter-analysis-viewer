import type { StateInformationViewDataConfiguration } from "./dataViewConfigTypes";

import PROVISIONAL_BALLOT_VIEW from "./views/provisionalBallots";
import ACTIVE_VOTER_VIEW from "./views/activeVoters";
import MAIL_BALLOT_REJECTION_VIEW from "./views/mailBallotRejections";
import POLLBOOK_DELETIONS_VIEW from "./views/pollbookDeletions";
import VOTER_REGISTRATION_VIEW from "./views/voterRegistration";
import CVAP_INFO_VIEW from "./views/cvapInfo";
import CVAP_PERCENTAGE_VIEW from "./views/cvapPercentage";
import COMPARE_VOTER_REGISTRATION_HISTORY_VIEW from "./views/compareVoterRegistrationHistory";
import REJECTED_BALLOTS_CHART_VIEW from "./views/rejectedBallots";
import MAIL_IN_VOTING_CHART_VIEW from "./views/mailInVotingChart";
import VOTER_REGISTRATION_TABLE_VIEW from "./views/voterRegistrationTable";
import VOTING_EQUIPMENT_BY_TYPE_VIEW from "./views/votingEquipmentByType";
import VOTING_EQUIPMENT_BY_AGE_VIEW from "./views/votingEquipmentByAge";
import VOTING_EQUIPMENT_SUMMARY_VIEW from "./views/votingEquipmentSummary";
import ECOLOGICAL_INFERENCE_GINGLES_CHART_VIEW from "./views/ecologicalInferenceGinglesChart";
import ECOLOGICAL_INFERENCE_VOTING_EQUIPMENT_VIEW from "./views/ecologicalInferenceVotingEquipment";
import ECOLOGICAL_INFERENCE_REJECTED_BALLOTS_VIEW from "./views/ecologicalInferenceRejectedBallots";

const FACT_VIEW_CONFIGURATIONS: Record<number, StateInformationViewDataConfiguration> = {
    ...PROVISIONAL_BALLOT_VIEW,
    ...ACTIVE_VOTER_VIEW,
    ...MAIL_BALLOT_REJECTION_VIEW,
    ...POLLBOOK_DELETIONS_VIEW,
    ...VOTER_REGISTRATION_VIEW,
    ...CVAP_INFO_VIEW,
    ...CVAP_PERCENTAGE_VIEW,
    ...COMPARE_VOTER_REGISTRATION_HISTORY_VIEW,
    ...REJECTED_BALLOTS_CHART_VIEW,
    ...MAIL_IN_VOTING_CHART_VIEW,
    ...VOTER_REGISTRATION_TABLE_VIEW,
    ...VOTING_EQUIPMENT_BY_TYPE_VIEW,
    ...VOTING_EQUIPMENT_BY_AGE_VIEW,
    ...VOTING_EQUIPMENT_SUMMARY_VIEW,
    ...ECOLOGICAL_INFERENCE_GINGLES_CHART_VIEW,
    ...ECOLOGICAL_INFERENCE_VOTING_EQUIPMENT_VIEW,
    ...ECOLOGICAL_INFERENCE_REJECTED_BALLOTS_VIEW,
}

export { FACT_VIEW_CONFIGURATIONS, type StateInformationViewDataConfiguration, };