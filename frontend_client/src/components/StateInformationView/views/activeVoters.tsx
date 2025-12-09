import { getVoterRegistrationCounts, type VoterRegistrationStatisticsModel } from "../../../api/client";
import { ACTIVE_VOTER_REGISTRATION_COLUMNS, bargraphDataForActiveVoterRegistrations } from "../dataColumns";
import { STATE_INFORMATION_VIEW_TYPE_SIMPLE, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_ACTIVE_VOTERS } from "./viewIds";

export default {
  [ID_SELECTION_ACTIVE_VOTERS]: {
    path: "active-voters",
    description: {
      type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
      barGraphTitle: "Voter Registration Count",
      barGraphXTitle: "Voter Categories",
      dataColumnSet: ACTIVE_VOTER_REGISTRATION_COLUMNS,
      barDataGenerator: bargraphDataForActiveVoterRegistrations,
      rowDataGenerators: [getVoterRegistrationCounts],
      ratioGenerator: (row: VoterRegistrationStatisticsModel) => [row.active!, row.total!],
    },
  } as StateInformationViewDataConfiguration,
};
