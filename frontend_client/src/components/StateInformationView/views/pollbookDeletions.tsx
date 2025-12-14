import { getPollbookDeletions, getVoterRegistrationCounts, type PollbookDeletionStatisticsModel } from "../../../api/client";
import { ACTIVE_VOTER_REGISTRATION_COLUMNS, bargraphDataForPollBookDeletions } from "../dataColumns";
import { STATE_INFORMATION_VIEW_TYPE_SIMPLE, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_POLLBOOK_DELETION } from "./viewIds";

export default {
  [ID_SELECTION_POLLBOOK_DELETION]: {
    path: "pollbook-deletions",
    description: {
      type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
      barGraphTitle: "Poll Book Deletions",
      barGraphXTitle: "Deletion Reasons",
      dataColumnSet: ACTIVE_VOTER_REGISTRATION_COLUMNS,
      barDataGenerator: bargraphDataForPollBookDeletions,
      rowDataGenerators: [getPollbookDeletions, getVoterRegistrationCounts],
      ratioGenerator: (row: PollbookDeletionStatisticsModel) => [row.totalRemoved!, row.totalRegisteredVoters!],
      ratioTitle: "Deletion Rate: ",
    },
  } as StateInformationViewDataConfiguration,
};
