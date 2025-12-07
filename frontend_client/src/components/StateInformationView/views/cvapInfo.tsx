import { getCVAPStatisticsData, type CVAPStatisticsModel } from "../../../api/client";
import { CVAP_INFO_COLUMNS, bargraphDataForCVAPInfo } from "../dataColumns";
import { STATE_INFORMATION_VIEW_TYPE_SIMPLE, type StateInformationViewDataConfiguration } from "../dataViewConfigTypes";
import { ID_SELECTION_VIEW_CVAP_INFO } from "./viewIds";

const CVAP_KEYS = ["asianTotal", "blackTotal", "hispanicTotal", "whiteTotal", "otherTotal"] as const;

export default {
  [ID_SELECTION_VIEW_CVAP_INFO]: {
    path: "cvap",
    description: {
      type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
      barGraphTitle: "CVAP Composition",
      barGraphXTitle: "Race",
      dataColumnSet: CVAP_INFO_COLUMNS,
      barDataGenerator: bargraphDataForCVAPInfo,
      rowDataGenerators: [getCVAPStatisticsData],
      ratioGenerator: (row: CVAPStatisticsModel, arg0: number) => [row[CVAP_KEYS[arg0]]!, row.cvapTotal!],
    },
  } as StateInformationViewDataConfiguration,
};
