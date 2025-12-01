import type { GridColDef } from "@mui/x-data-grid";
import type {
  PollbookDeletionStatisticsModel,
  ProvisionalBallotStatisticsModel,
  VoterRegistrationStatisticsModel,
  MailBallotRejectionStatisticsModel,
  VoterRegistrationHistoryGraphDataModel,
  VotingEquipmentUsageStatisticsModel,
  VoterAffiliationStatisticsModel,
  CVAPStatisticsModel,
} from "../../api/client";

import {
  getProvisionalBallots,
  getMailBallotRejections,
  getVoterRegistrationCounts,
  getPollbookDeletions,
  getDetailedVoterRegistrationDataCount,
  getVoterRegistrationHistory,
  getDetailedVotingEquipmentUsage,
  getElectionResultsSummary,
  getBallotStatistics,
  getVoterAffiliations,
  getCVAPStatisticsData,
} from "../../api/client";

import useChoroplethStylingFunction from "../../hooks/useChoroplethStylingFunction";

import { PERCENTAGE_CHOROPLETH_BUCKETS, VOTING_EQUIPMENT_AGE_CHOROPLETH_BUCKETS } from "../../helpers/choroplethBuckets";

import { useLocation, useParams, useNavigate, Routes, Route } from "react-router";

import InboxIcon from "@mui/icons-material/Inbox";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BallotIcon from "@mui/icons-material/Ballot";
import PersonIcon from "@mui/icons-material/Person";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ScannerIcon from "@mui/icons-material/Scanner";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import HowToVoteIcon from "@mui/icons-material/HowToVote";

import Stack from "@mui/material/Stack";

import { Box, Paper, Typography, useTheme, Backdrop, Grow, Tabs, Tab, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

import {
  DETAIL_STATE_TYPE_DEMOCRAT,
  DETAIL_STATE_TYPE_REPUBLICAN,
  DETAIL_STATE_TYPE_VOTER_REGISTRATION,
  getDetailStateType,
  isDetailState,
  type DetailStateType,
} from "../FullBoundedUSMap/detailedStatesInfo";

import { useState, useEffect } from "react";

import styles from "./StateInformationView.module.css";
import StateMap from "../StateMap";

import { FIPS_TO_STATES_MAP } from "../FullBoundedUSMap/boundaryData";
import { StateInformationViewDrawer } from "./StateInformationViewDrawer";
import useKeyDown from "../../hooks/useKeyDown";
import useCssCalc from "../../hooks/useCssCalc";
import StyledDataGrid from "../StyledDataGrid";

import {
  ACTIVE_VOTER_REGISTRATION_COLUMNS,
  bargraphDataForActiveVoterRegistrations,
  bargraphDataForMailBallotRejections,
  bargraphDataForPollBookDeletions,
  bargraphDataForProvisionalBallots,
  bargraphDataForVoterAffiliations,
  MAIL_BALLOT_REJECTION_COLUMNS,
  PROVISIONAL_BALLOT_COLUMNS,
  VOTING_EQUIPMENT_COLUMNS,
  bargraphDataForVotingEquipmentUsages,
  VOTER_AFFILIATION_COLUMNS,
  CVAP_INFO_COLUMNS,
  bargraphDataForCVAPInfo,
} from "./dataColumns";

import FullScreenDetailedVoterRegistrationTable from "../FullScreenDetailedVoterRegistrationTable";

import { type GradientMap } from "../../helpers/GradientMap";
import GradientMapLegend from "../GradientMapLegend";
import ColorKeyLegend from "../ColorKeyLegend";

import { equipmentQualityData } from "../DataDisplays/PartyStatesMockData";
import BarChart, { type BarChartDataEntry } from "../DataDisplays/BarChart";
import GeoUnitBubbleChart from "../DataDisplays/GeoUnitBubbleChart";
import BubbleChart from "../DataDisplays/BubbleChart";
import LineChart from "../DataDisplays/LineChart";

const ID_SELECTION_PROVISIONAL_BALLOT = 0;
const ID_SELECTION_ACTIVE_VOTERS = 1;
const ID_SELECTION_POLLBOOK_DELETION = 2;
const ID_SELECTION_MAIL_BALLOT_REJECTIONS = 3;
const ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES = 10;

const ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE = 4;
const ID_SELECTION_VOTING_EQUIPMENT_BY_AGE = 5;
const ID_SELECTION_REJECTED_BALLOTS = 6;
const ID_SELECTION_MAIL_IN_VOTING = 7;

const ID_SELECTION_VOTER_REGISTRATION = 8;
const ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE = 9;
const ID_SELECTION_VIEW_CVAP_INFO = 11;
const ID_SELECTION_VIEW_CVAP_PERCENTAGE = 12;

const defaultDropDownSections = [
  {
    title: "Ballot Data",
    iconComponent: <BallotIcon />,
    items: [
      { id: ID_SELECTION_PROVISIONAL_BALLOT, iconComponent: <InboxIcon />, textContent: "Provisional Ballots" },
      { id: ID_SELECTION_ACTIVE_VOTERS, iconComponent: <PersonIcon />, textContent: "Active Voters" },
      { id: ID_SELECTION_POLLBOOK_DELETION, iconComponent: <DeleteForeverIcon />, textContent: "Pollbook Deletions" },
      { id: ID_SELECTION_MAIL_BALLOT_REJECTIONS, iconComponent: <PersonOffIcon />, textContent: "Mail Ballot Rejections" },
    ],
  },
  {
    title: "Voting Equipment",
    items: [
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE, iconComponent: <ScannerIcon />, textContent: "By Type" },
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_AGE, iconComponent: <AccessTimeIcon />, textContent: "By Age" },
    ],
  },
  {
    title: "Voter Registration",
    items: [{ id: ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES, iconComponent: <PersonIcon />, textContent: "Registration by Year" }],
  },
];

const partyStateDropDownSections = [
  {
    title: "Ballot Data",
    iconComponent: <BallotIcon />,
    items: [
      { id: ID_SELECTION_PROVISIONAL_BALLOT, iconComponent: <InboxIcon />, textContent: "Provisional Ballots" },
      { id: ID_SELECTION_ACTIVE_VOTERS, iconComponent: <PersonIcon />, textContent: "Active Voters" },
      { id: ID_SELECTION_POLLBOOK_DELETION, iconComponent: <DeleteForeverIcon />, textContent: "Pollbook Deletions" },
      { id: ID_SELECTION_MAIL_BALLOT_REJECTIONS, iconComponent: <PersonOffIcon />, textContent: "Mail Ballot Rejections" },
      { id: ID_SELECTION_MAIL_IN_VOTING, iconComponent: <HowToVoteIcon />, textContent: "Mail-In Voting" },
      { id: ID_SELECTION_REJECTED_BALLOTS, iconComponent: <DoNotDisturbIcon />, textContent: "Rejected Ballots" },
    ],
  },
  {
    title: "Voting Equipment",
    items: [
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE, iconComponent: <AccessTimeIcon />, textContent: "By Type" },
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_AGE, iconComponent: <ScannerIcon />, textContent: "By Age" },
    ],
  },
  {
    title: "Voter Registration",
    items: [
      { id: ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES, iconComponent: <PersonIcon />, textContent: "Registration by Year" },
      { id: ID_SELECTION_VIEW_CVAP_INFO, iconComponent: <PersonIcon />, textContent: "CVAP Statistics" },
      { id: ID_SELECTION_VIEW_CVAP_PERCENTAGE, iconComponent: <PersonIcon />, textContent: "CVAP Registration" },
    ],
  },
];

const voterRegistrationStateDropDownSections = [
  {
    title: "Ballot Data",
    iconComponent: <BallotIcon />,
    items: [
      { id: ID_SELECTION_PROVISIONAL_BALLOT, iconComponent: <InboxIcon />, textContent: "Provisional Ballots" },
      { id: ID_SELECTION_ACTIVE_VOTERS, iconComponent: <PersonIcon />, textContent: "Active Voters" },
      { id: ID_SELECTION_POLLBOOK_DELETION, iconComponent: <DeleteForeverIcon />, textContent: "Pollbook Deletions" },
      { id: ID_SELECTION_MAIL_BALLOT_REJECTIONS, iconComponent: <PersonOffIcon />, textContent: "Mail Ballot Rejections" },
    ],
  },
  {
    title: "Voting Equipment",
    items: [
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE, iconComponent: <ScannerIcon />, textContent: "By Type" },
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_AGE, iconComponent: <AccessTimeIcon />, textContent: "By Age" },
    ],
  },
  {
    title: "Voter Registration",
    items: [
      { id: ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES, iconComponent: <PersonIcon />, textContent: "Registration by Year" },
      { id: ID_SELECTION_VOTER_REGISTRATION, iconComponent: <PersonIcon />, textContent: "Registration Data" },
      { id: ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE, iconComponent: <PersonIcon />, textContent: "Registered Voters" },
    ],
  },
];

function pickDropdownType(stateType: DetailStateType[]) {
  const partyState = stateType.some((x) => x === DETAIL_STATE_TYPE_REPUBLICAN || x === DETAIL_STATE_TYPE_DEMOCRAT);
  const voterRegistrationState = stateType.some((x) => x === DETAIL_STATE_TYPE_VOTER_REGISTRATION);
  const result = [...defaultDropDownSections];
  if (partyState || voterRegistrationState) {
    if (partyState) {
      result[0] = partyStateDropDownSections[0];
      result[2] = partyStateDropDownSections[2];
    }
    if (voterRegistrationState) {
      result[2] = voterRegistrationStateDropDownSections[2];
    }
    return result;
  }
  return result;
}

const votingEquipmentTypeColors = [
  {
    text: "DRE (No VVPAT)",
    color: "green",
  },
  {
    text: "DRE (VVPAT)",
    color: "blue",
  },
  {
    text: "BMD",
    color: "yellow",
  },
  {
    text: "Scanner",
    color: "red",
  },
];

type EAVsGeneralFact =
  | ProvisionalBallotStatisticsModel
  | PollbookDeletionStatisticsModel
  | MailBallotRejectionStatisticsModel
  | VoterRegistrationStatisticsModel
  | VotingEquipmentUsageStatisticsModel;

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function getUrlForModeId(id: number, fipsCode: string) {
  switch (id) {
    case ID_SELECTION_PROVISIONAL_BALLOT:
      return `/state/${fipsCode}/provisional-ballots`;
    case ID_SELECTION_MAIL_BALLOT_REJECTIONS:
      return `/state/${fipsCode}/mail-ballot-rejections`;
    case ID_SELECTION_ACTIVE_VOTERS:
      return `/state/${fipsCode}/active-voters`;
    case ID_SELECTION_POLLBOOK_DELETION:
      return `/state/${fipsCode}/pollbook-deletions`;
    case ID_SELECTION_VOTER_REGISTRATION:
      return `/state/${fipsCode}/voter-registration`;
    case ID_SELECTION_VIEW_CVAP_PERCENTAGE:
      return `/state/${fipsCode}/cvap-registration`;
    case ID_SELECTION_VIEW_CVAP_INFO:
      return `/state/${fipsCode}/cvap`;
    case ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES:
      return `/state/${fipsCode}/compare-voter-registration-rates/`;
    case ID_SELECTION_REJECTED_BALLOTS:
      return `/state/${fipsCode}/rejected-ballots-chart/`;
    case ID_SELECTION_MAIL_IN_VOTING:
      return `/state/${fipsCode}/mail-in-chart/`;
    case ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE:
      return `/state/${fipsCode}/voter-table/`;
    case ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE:
      return `/state/${fipsCode}/equipment-by-type/`;
  }
  return "?";
}

function determineInitialStateBasedOnUrl(pathname: string) {
  if (pathname.includes("/provisional-ballots")) {
    return ID_SELECTION_PROVISIONAL_BALLOT;
  } else if (pathname.includes("/mail-ballot-rejections")) {
    return ID_SELECTION_MAIL_BALLOT_REJECTIONS;
  } else if (pathname.includes("/active-voters")) {
    return ID_SELECTION_ACTIVE_VOTERS;
  } else if (pathname.includes("/pollbook-deletions")) {
    return ID_SELECTION_POLLBOOK_DELETION;
  } else if (pathname.includes("/voter-registration")) {
    return ID_SELECTION_VOTER_REGISTRATION;
  } else if (pathname.includes("/rejected-ballots-chart")) {
    return ID_SELECTION_REJECTED_BALLOTS;
  } else if (pathname.includes("/mail-in-chart/")) {
    return ID_SELECTION_MAIL_IN_VOTING;
  } else if (pathname.includes("/voter-table/")) {
    return ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE;
  } else if (pathname.includes("/equipment-by-type/")) {
    return ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE;
  } else if (pathname.includes("/cvap-registration")) {
    return ID_SELECTION_VIEW_CVAP_PERCENTAGE;
  } else if (pathname.includes("/cvap")) {
    return ID_SELECTION_VIEW_CVAP_INFO;
  }
  return ID_SELECTION_PROVISIONAL_BALLOT;
}

// NOTE(jery):
// needed to make the patterns for the
// voting equipment type map display.
const CountyGradientSet = (data: VotingEquipmentUsageStatisticsModel, colorSet: string[]) => {
  const colors = [];

  if (data.dreNoVvpatTotal! > 0) {
    colors.push(colorSet[0]);
  }

  if (data.dreVvpatTotal! > 0) {
    colors.push(colorSet[1]);
  }

  if (data.bmdTotal! > 0) {
    colors.push(colorSet[2]);
  }

  if (data.scannerTotal! > 0) {
    colors.push(colorSet[3]);
  }

  // NOTE(jerry):
  // While there is absolutely a programmatic
  // way to do this, I'm not going to be very
  // clever about this.

  const x1 = 25;
  const y1 = 25;
  const x2 = (x1 * 1.2) / colors.length;
  const y2 = (y1 * 1.2) / colors.length;

  switch (colors.length) {
    case 1:
      return (
        <linearGradient id={`vt${data.fullRegionId}`} gradientTransform="">
          <stop offset="0" stop-color={colors[0]} />
          <stop offset="100%" stop-color={colors[0]} />
        </linearGradient>
      );
    case 2:
      return (
        <linearGradient
          id={`vt${data.fullRegionId}`}
          gradientTransform="rotate(0)"
          x1={x1 + "%"}
          y1={y1 + "%"}
          x2={x2 + "%"}
          y2={y2 + "%"}
          spreadMethod="repeat"
        >
          <stop offset="0" stop-color={colors[0]} />
          <stop offset="50%" stop-color={colors[0]} />
          <stop offset="50%" stop-color={colors[1]} />
          <stop offset="100%" stop-color={colors[1]} />
        </linearGradient>
      );
    case 3:
      return (
        <linearGradient
          id={`vt${data.fullRegionId}`}
          gradientTransform="rotate(0)"
          x1={x1 + "%"}
          y1={y1 + "%"}
          x2={x2 + "%"}
          y2={y2 + "%"}
          spreadMethod="repeat"
        >
          <stop offset="0" stop-color={colors[0]} />
          <stop offset="33%" stop-color={colors[0]} />
          <stop offset="33%" stop-color={colors[1]} />
          <stop offset="66%" stop-color={colors[1]} />
          <stop offset="66%" stop-color={colors[2]} />
          <stop offset="100%" stop-color={colors[2]} />
        </linearGradient>
      );
    case 4:
      return (
        <linearGradient
          id={`vt${data.fullRegionId}`}
          gradientTransform="rotate(0)"
          x1={x1 + "%"}
          y1={y1 + "%"}
          x2={x2 + "%"}
          y2={y2 + "%"}
          spreadMethod="repeat"
        >
          <stop offset="0" stop-color={colors[0]} />
          <stop offset="25%" stop-color={colors[0]} />
          <stop offset="25%" stop-color={colors[1]} />
          <stop offset="50%" stop-color={colors[1]} />
          <stop offset="50%" stop-color={colors[2]} />
          <stop offset="75%" stop-color={colors[2]} />
          <stop offset="75%" stop-color={colors[3]} />
          <stop offset="100%" stop-color={colors[3]} />
        </linearGradient>
      );
  }
};

const CountyGradientStyleClass = (data: VotingEquipmentUsageStatisticsModel) => {
  return (
    <style>
      {`
.vt${data.fullRegionId} {
fill: url("#vt${data.fullRegionId}");
fill-opacity: 0.55;
}
`}
    </style>
  );
};

function StateInformationView() {
  const { fipsCode } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const stateType = getDetailStateType(fipsCode!);
  const location = useLocation();
  const activeDataStateHook = useState(determineInitialStateBasedOnUrl(location.pathname));

  /* NOTE(jerry): size tuning parameters */
  const boxMarginTop = "2vh";
  const selectionDrawerWidth = "15em";
  const maxWidthForMap = "44vw";
  const heightUsage = "88vh";
  const maxHeightForMap = heightUsage;
  const remainingWidthAfterSelectionDrawer = useCssCalc(`calc(100vw - (${selectionDrawerWidth} + 1.5em + ${maxWidthForMap} + 1vw))`);
  const maxWidthForTable = remainingWidthAfterSelectionDrawer;
  const maxHeightForTable = useCssCalc(`calc(${heightUsage} / 2)`);
  const maxWidthForChart = maxWidthForTable;
  const maxHeightForChart = maxHeightForTable;

  const bubbleChartWidth = useCssCalc("75vw");
  const bubbleChartHeight = useCssCalc("90vh");

  const activeDataState = activeDataStateHook[0];
  const [dataCols, setDataColumns] = useState<GridColDef<EAVsGeneralFact[]>[]>([]);
  const [dataRows, setDataRows] = useState<EAVsGeneralFact[]>([]);
  const [barData, setBarData] = useState<BarChartDataEntry[]>([]);
  const [barGraphTitle, setBarGraphTitle] = useState<string>("");
  const [barGraphXTitle, setBarGraphXTitle] = useState<string>("");
  const [gradientMap, setGradientMap] = useState<GradientMap>([]);
  const [viewDetailedVoterRegistrationBubbleChart, setViewDetailedVoterRegistrationBubbleChart] = useState(false);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [cvapDemographicSelection, setCvapDemographicSelection] = useState(0);

  const tryingToViewDetailedVoterRegistration =
    stateType.some((x) => x === DETAIL_STATE_TYPE_VOTER_REGISTRATION) && activeDataState === ID_SELECTION_VOTER_REGISTRATION;

  const shouldOpenPopup = ["mail-in-chart", "rejected-ballots-chart", "voter-table", "compare-voter-registration-rates"].some((x) =>
    location.pathname.includes(x)
  );

  useEffect(
    function () {
      (async function () {
        switch (activeDataState) {
          case ID_SELECTION_PROVISIONAL_BALLOT:
            {
              const promises = [true, false].map((v) => getProvisionalBallots(fipsCode!, { aggregate: v }));
              const [aggregatedData, data] = await Promise.all(promises);
              setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - Provisional Ballots`);
              setBarGraphXTitle("Ballots Cast");
              setDataRows(
                data.map((x) => {
                  return { id: x.fullRegionId, ...x };
                })
              );
              setDataColumns(PROVISIONAL_BALLOT_COLUMNS);
              setBarData(bargraphDataForProvisionalBallots(aggregatedData[0]));
            }
            break;
          case ID_SELECTION_MAIL_BALLOT_REJECTIONS:
            {
              const promises = [true, false].map((v) => getMailBallotRejections(fipsCode!, { aggregate: v }));
              const [aggregatedData, data] = await Promise.all(promises);
              setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - Mail Ballots Rejection`);
              setBarGraphXTitle("Rejection Reasons");
              setDataRows(
                data.map((x) => {
                  return { id: x.fullRegionId, ...x };
                })
              );
              setDataColumns(MAIL_BALLOT_REJECTION_COLUMNS);
              setBarData(bargraphDataForMailBallotRejections(aggregatedData[0]));
            }
            break;
          case ID_SELECTION_ACTIVE_VOTERS:
            {
              const promises = [true, false].map((v) => getVoterRegistrationCounts(fipsCode!, { aggregate: v }));
              const [aggregatedData, data] = await Promise.all(promises);
              setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - Voter Registration Count`);
              setBarGraphXTitle("Voter Categories");
              setDataRows(
                data.map((x) => {
                  return { id: x.fullRegionId, ...x };
                })
              );
              setDataColumns(ACTIVE_VOTER_REGISTRATION_COLUMNS);
              setBarData(bargraphDataForActiveVoterRegistrations(aggregatedData[0]));
            }
            break;
          case ID_SELECTION_VOTER_REGISTRATION:
            {
              const promises = [true, false].map((v) => getVoterAffiliations(fipsCode!, { aggregate: v }));
              const [aggregatedData, data] = await Promise.all(promises);
              setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - Voter Affiliation Count`);
              setBarGraphXTitle("Voter Party");
              setDataRows(
                data.map((x) => {
                  return { id: x.fullRegionId, ...x };
                })
              );
              setDataColumns(VOTER_AFFILIATION_COLUMNS);
              setBarData(bargraphDataForVoterAffiliations(aggregatedData[0]));
              // TODO: finish this for GUI17 completion.
            }
            break;
          case ID_SELECTION_VOTING_EQUIPMENT_BY_AGE:
            {
              const promises = [true, false].map((v) => getDetailedVotingEquipmentUsage(fipsCode!, { aggregate: v }));
              const [aggregatedData, data] = await Promise.all(promises);
              setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - Voting Equipment Type Count`);
              setBarGraphXTitle("Equipment Type");
              setDataRows(
                data.map((x) => {
                  return { id: x.fullRegionId, ...x };
                })
              );
              setDataColumns(VOTING_EQUIPMENT_COLUMNS);
              setBarData(bargraphDataForVotingEquipmentUsages(aggregatedData[0]));
            }
            break;
          case ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE:
            {
              const promises = [true, false].map((v) => getDetailedVotingEquipmentUsage(fipsCode!, { aggregate: v }));
              const [aggregatedData, data] = await Promise.all(promises);
              setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - Voting Equipment Type Count`);
              setBarGraphXTitle("Equipment Type");
              setDataRows(
                data.map((x) => {
                  return { id: x.fullRegionId, ...x };
                })
              );
              setDataColumns(VOTING_EQUIPMENT_COLUMNS);
              setBarData(bargraphDataForVotingEquipmentUsages(aggregatedData[0]));
            }
            break;
          case ID_SELECTION_VIEW_CVAP_INFO:
            {
              const promises = [true, false].map((v) => getCVAPStatisticsData(fipsCode!, { aggregate: v }));
              const [aggregatedData, data] = await Promise.all(promises);
              setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - CVAP Composition`);
              setBarGraphXTitle("Race");
              setDataRows(
                data.map((x) => {
                  return { id: x.fullRegionId, ...x };
                })
              );
              setDataColumns(CVAP_INFO_COLUMNS);
              setBarData(bargraphDataForCVAPInfo(aggregatedData[0]));
            }
            break;
          case ID_SELECTION_VIEW_CVAP_PERCENTAGE:
            {
              const promises = [true, false].map((v) => getCVAPStatisticsData(fipsCode!, { aggregate: v }));
              const activeVoterPromises = [true, false].map((v) => getVoterRegistrationCounts(fipsCode!, { aggregate: v }));
              const [aggregatedData, data] = await Promise.all(promises);
              const [_activeVoterAggregatedData, activeVoterData] = await Promise.all(activeVoterPromises);

              setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - CVAP Composition`);
              setBarGraphXTitle("Race");
              setDataRows(
                data.map((x, i) => {
                  return { id: x.fullRegionId, ...x, ...activeVoterData[i] };
                })
              );
              setDataColumns(CVAP_INFO_COLUMNS);
              setBarData(bargraphDataForCVAPInfo(aggregatedData[0]));
            }
            break;
          case ID_SELECTION_POLLBOOK_DELETION:
            {
              const promises = [true, false].map((v) => getPollbookDeletions(fipsCode!, { aggregate: v }));
              const activeVoterPromises = [true, false].map((v) => getVoterRegistrationCounts(fipsCode!, { aggregate: v }));
              const [aggregatedData, data] = await Promise.all(promises);
              setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - Poll Book Deletions`);
              setBarGraphXTitle("Deletion Reasons");
              setDataRows(
                (await activeVoterPromises[1]).map((x, i) => {
                  return { id: x.fullRegionId, ...x, ...data[i] };
                })
              );
              setDataColumns(ACTIVE_VOTER_REGISTRATION_COLUMNS);
              setBarData(bargraphDataForPollBookDeletions(aggregatedData[0]));
            }
            break;
          default:
            {
              // not handled yet.
            }
            break;
        }

        if (activeDataState === ID_SELECTION_VOTING_EQUIPMENT_BY_AGE) {
          setGradientMap(VOTING_EQUIPMENT_AGE_CHOROPLETH_BUCKETS);
        } else {
          setGradientMap(PERCENTAGE_CHOROPLETH_BUCKETS);
        }
      })();
    },
    [activeDataState, fipsCode, navigate]
  );

  useKeyDown("Escape", () => navigate("/"));

  const votingEquipmentMapStylingFunction = (feature: GeoJSON.Feature) => {
    const { properties } = feature;
    const fullRegionId = (properties!.STATEFP as string) + (properties!.COUNTYFP as string) + "00000";
    const style = {
      color: "black",
      className: `vt${fullRegionId}`,
      fillOpacity: 0.0,
      weight: 2.5,
    };

    return style;
  };

  const choroplethStylingFunction = useChoroplethStylingFunction((feature: GeoJSON.Feature) => {
    if (!isDetailState(fipsCode!) || (tryingToViewDetailedVoterRegistration && viewDetailedVoterRegistrationBubbleChart)) {
      return null;
    }

    const { properties } = feature;
    const fullRegionId = (properties!.STATEFP as string) + (properties!.COUNTYFP as string) + "00000";
    const row = dataRows.find((r) => r.fullRegionId === fullRegionId);

    let colorPoint: number | null = null;
    if (row) {
      let dataEntry: number = 0;
      let dataEntryTotal: number = 0;
      switch (activeDataState) {
        case ID_SELECTION_PROVISIONAL_BALLOT:
          dataEntry = (row as ProvisionalBallotStatisticsModel).totalProvisionalBallotsCast!;
          dataEntryTotal = (row as ProvisionalBallotStatisticsModel).totalBallotsCast!;
          break;
        case ID_SELECTION_ACTIVE_VOTERS:
          dataEntry = (row as VoterRegistrationStatisticsModel).active!;
          dataEntryTotal = (row as VoterRegistrationStatisticsModel).total!;
          break;
        case ID_SELECTION_POLLBOOK_DELETION:
          dataEntry = (row as PollbookDeletionStatisticsModel).totalRemoved!;
          dataEntryTotal = (row as PollbookDeletionStatisticsModel).totalRegisteredVoters!;
          console.log(dataEntry, dataEntryTotal);
          break;
        case ID_SELECTION_MAIL_BALLOT_REJECTIONS:
          dataEntry = (row as MailBallotRejectionStatisticsModel).rejectTotal!;
          dataEntryTotal = (row as MailBallotRejectionStatisticsModel).totalBallotsByMail!;
          break;
        case ID_SELECTION_VOTING_EQUIPMENT_BY_AGE:
          dataEntry = (row as VotingEquipmentUsageStatisticsModel).averageAge!;
          dataEntryTotal = 100; // HACKME(jerry): to avoid writing more special case code.
          break;
        case ID_SELECTION_VIEW_CVAP_PERCENTAGE:
          dataEntryTotal = (row as VoterRegistrationStatisticsModel).total!;
          dataEntry = (row as CVAPStatisticsModel).cvapTotal!;
          break;
        case ID_SELECTION_VIEW_CVAP_INFO:
          dataEntryTotal = (row as CVAPStatisticsModel).cvapTotal!;
          dataEntry = 0;
          switch (cvapDemographicSelection) {
            case 0:
              {
                dataEntry = (row as CVAPStatisticsModel).asianTotal!;
              }
              break;
            case 1:
              {
                dataEntry = (row as CVAPStatisticsModel).blackTotal!;
              }
              break;
            case 2:
              {
                dataEntry = (row as CVAPStatisticsModel).hispanicTotal!;
              }
              break;
            case 3:
              {
                dataEntry = (row as CVAPStatisticsModel).whiteTotal!;
              }
              break;
            case 4:
              {
                dataEntry = (row as CVAPStatisticsModel).otherTotal!;
              }
              break;
          }
          break;
        case ID_SELECTION_VOTER_REGISTRATION:
          dataEntry = (row as VoterAffiliationStatisticsModel).activeRegisteredVotersTotal!;
          dataEntryTotal = (row as VoterAffiliationStatisticsModel).registeredVotersTotal!;
          break;
      }
      if (dataEntryTotal !== 0) {
        colorPoint = (dataEntry / dataEntryTotal) * 100;
      }
    }
    return colorPoint;
  }, gradientMap);

  return (
    <div
      className={styles.stateInformationPopup}
      style={{
        left: `calc(${selectionDrawerWidth} + 1.5em)`,
      }}
    >
      <svg width="0" height="0">
        <defs>
          {dataRows.map((x) =>
            CountyGradientSet(
              x,
              votingEquipmentTypeColors.map((c) => c.color)
            )
          )}
        </defs>
      </svg>
      {dataRows.map(CountyGradientStyleClass)}

      <StateInformationViewDrawer
        stateHook={activeDataStateHook}
        onSelection={(id) => {
          navigate(getUrlForModeId(id, fipsCode!));
        }}
        sections={pickDropdownType(stateType)}
        stateType={getDetailStateType(fipsCode!)}
        drawerWidth={selectionDrawerWidth}
        topMargin={boxMarginTop}
      />
      <Stack
        spacing={7.5}
        direction="column"
        sx={{
          mt: boxMarginTop,
          left: selectionDrawerWidth,
        }}
      >
        <Paper
          sx={{
            mt: 0,
            ml: "auto",
            width: maxWidthForMap,
            height: maxHeightForMap,
          }}
          elevation={5}
        >
          {tryingToViewDetailedVoterRegistration && (
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={viewDetailedVoterRegistrationBubbleChart ? 1 : 0}
                onChange={function (_, x) {
                  setViewDetailedVoterRegistrationBubbleChart(x == 1);
                }}
                textColor="secondary"
                indicatorColor="secondary"
                variant="fullWidth"
              >
                <Tab label={"Choropleth"} {...a11yProps(0)} />
                <Tab label={"Bubblechart Overlay"} {...a11yProps(1)} />
              </Tabs>
            </Box>
          )}
          <StateMap
            // @ts-expect-error, the style function *is* of the right type
            // although it's not immediately obvious to typescript atm.
            styleFunction={activeDataState === ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE ? votingEquipmentMapStylingFunction : choroplethStylingFunction}
            mapKey={activeDataState}
            width={maxWidthForMap}
            height={maxHeightForMap}
            fipsCode={fipsCode}
            onFeatureClick={function (feature: GeoJSON.Feature) {
              const geounitFipsCode = feature.properties!.COUNTYFP;
              const fullyPaddedFipsCode = fipsCode + geounitFipsCode.padStart(3, "0") + "00000";

              if (activeDataState === ID_SELECTION_VOTER_REGISTRATION || activeDataState === ID_SELECTION_ACTIVE_VOTERS) {
                navigate(`/state/${fipsCode}/voter-table/${fullyPaddedFipsCode}`);
              }
            }}
          >
            {isDetailState(fipsCode!) &&
              !(tryingToViewDetailedVoterRegistration && viewDetailedVoterRegistrationBubbleChart) &&
              activeDataState !== ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE && <GradientMapLegend gradientMap={gradientMap} />}
            {isDetailState(fipsCode!) &&
              !(tryingToViewDetailedVoterRegistration && viewDetailedVoterRegistrationBubbleChart) &&
              activeDataState === ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE && (
                <ColorKeyLegend colors={votingEquipmentTypeColors.map((x) => x.color)} labels={votingEquipmentTypeColors.map((x) => x.text)} />
              )}
            <Typography
              variant="h4"
              sx={{
                position: "relative",
                textAlign: "center",
                display: "inline",
                top: `calc(100% - 1.25em)`,
                left: `0`,
                paddingLeft: "0.45em",
                paddingRight: "1.0em",
                paddingBottom: "0.35em",
                paddingTop: "0.15em",
                background: "rgba(0.5, 0.5, 0.5, 0.7)",
                borderRadius: "0 16px 0 0",
                color: "white",
                fontWeight: "boldest",
                zIndex: 1000,
              }}
            >
              {FIPS_TO_STATES_MAP[fipsCode!]}
            </Typography>
            {activeDataState == ID_SELECTION_VIEW_CVAP_INFO && (
              <Box
                sx={{
                  position: "absolute",
                  p: 1.5,
                  left: `75%`,
                  top: `0`,
                  width: `calc(${maxWidthForMap} * 0.25)`,
                  zIndex: 1001,
                }}
              >
                <Paper>
                  <FormControl fullWidth>
                    <InputLabel>CVAP Demographic</InputLabel>
                    <Select onChange={(event) => setCvapDemographicSelection(event.target.value)} value={cvapDemographicSelection} label="CVAP Demographic">
                      {["Asian", "Black", "Hispanic", "White", "Other"].map((x, i) => (
                        <MenuItem value={i}>{x}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Paper>
              </Box>
            )}
            {tryingToViewDetailedVoterRegistration && viewDetailedVoterRegistrationBubbleChart && <GeoUnitBubbleChart fipsCode={fipsCode!} />}
          </StateMap>
        </Paper>
      </Stack>

      <Backdrop open={shouldOpenPopup} sx={{ zIndex: 1199 }} />
      <Grow in={shouldOpenPopup}>
        <Box
          sx={{
            position: "fixed",
            display: "flex",
            left: `calc(${selectionDrawerWidth} * 1.2)`,
            top: boxMarginTop,
            zIndex: 2000,
          }}
        >
          <Routes>
            <Route
              path="mail-in-chart"
              element={
                <BubbleChart
                  data={async () => {
                    const electionResultsData = await getElectionResultsSummary(fipsCode!, 2024);
                    const ballotStatisticsData = await getBallotStatistics(fipsCode!);
                    const mergedData = electionResultsData.map((e, i) => ({ ...e, ...ballotStatisticsData[i] }));

                    const republicanBubbleColor = "#d73027";
                    const democraticBubbleColor = "#4575b4";

                    return mergedData.map((data) => ({
                      x: (data.republicanVotes! / data.totalVotes!) * 100.0,
                      y: (data.totalBallotsByMail! / data.totalBallotsCast!) * 100.0,
                      name: data.regionName!,
                      size: data.regionName!.length,
                      color: data.republicanVotes! > data.democratVotes! ? republicanBubbleColor : democraticBubbleColor,
                    }));
                  }}
                  width={bubbleChartWidth}
                  height={bubbleChartHeight}
                  maxXScale={100}
                  title="Mail Ballots by Party"
                  xAxisLabel="Republican Votes (%)"
                  yAxisLabel="Mail Ballot Voting (%)"
                />
              }
            />
            <Route
              path="rejected-ballots-chart"
              element={
                <BubbleChart
                  data={equipmentQualityData}
                  width={bubbleChartWidth}
                  height={bubbleChartHeight}
                  title="Voting Equipment Quality"
                  xAxisLabel="Quality Level"
                  yAxisLabel="Rejected Ballots (%)"
                  useRegression
                />
              }
            />
            <Route
              path="compare-voter-registration-rates"
              element={
                <LineChart
                  //@ts-expect-error : Error expected, orval likes generating "optional" types even though they are actually identical.
                  data={async () => {
                    const votingHistory = await getVoterRegistrationHistory(fipsCode!);
                    const eavsColors = ["red", "blue", "green", "magenta", "black"];

                    // Manually assign back colors on the frontend.
                    return votingHistory.map((x, i) => ({ color: eavsColors[i], ...x }));
                  }}
                  width={bubbleChartWidth}
                  height={bubbleChartHeight}
                  title="Voter Registration By Year"
                  xAxisLabel="EAVs Unit"
                  yAxisLabel="Registered Voters"
                />
              }
            />
            <Route
              path="voter-table/:countyCode?"
              element={<FullScreenDetailedVoterRegistrationTable pageSize={15} width={bubbleChartWidth} height={bubbleChartHeight * 0.9} />}
            />
          </Routes>
        </Box>
      </Grow>
      <Stack
        spacing={0.2}
        sx={{
          mt: boxMarginTop,
          ml: 0.5,
        }}
      >
        <StyledDataGrid
          rows={dataRows}
          columns={dataCols}
          width={maxWidthForTable}
          maxWidth={maxWidthForTable}
          height={maxHeightForTable}
          maxHeight={maxHeightForTable}
          pageSize={7}
          getRowId={(r) => r.id}
        />
        <Box width={maxWidthForTable} height={500}>
          <Paper elevation={5}>
            <BarChart width={maxWidthForChart} height={maxHeightForChart} data={barData} title={barGraphTitle} xTitle={barGraphXTitle} />
          </Paper>
        </Box>
      </Stack>
    </div>
  );
}

export default StateInformationView;
