import type { GridColDef } from "@mui/x-data-grid";
import type {
  PollbookDeletionStatisticsModel,
  ProvisionalBallotStatisticsModel,
  VoterRegistrationStatisticsModel,
  MailBallotRejectionStatisticsModel,
  VotingEquipmentUsageStatisticsModel,
  VoterAffiliationStatisticsModel,
  CVAPStatisticsModel,
} from "../../api/client";

import {
  getProvisionalBallots,
  getMailBallotRejections,
  getVoterRegistrationCounts,
  getPollbookDeletions,
  getDetailedVotingEquipmentUsage,
  getVoterAffiliations,
  getCVAPStatisticsData,
} from "../../api/client";

import VOTING_EQUIPMENT_TYPE_COLORS from "../../helpers/votingEquipmentColorBuckets";

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
  DETAIL_STATE_TYPE_PRECLEARANCE_STATE,
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
  bargraphDataForActiveVoterRegistrations,
  bargraphDataForMailBallotRejections,
  bargraphDataForPollBookDeletions,
  bargraphDataForProvisionalBallots,
  bargraphDataForVoterAffiliations,
  bargraphDataForVotingEquipmentUsages,
  bargraphDataForCVAPInfo,
} from "./dataColumns";

import { type GradientMap } from "../../helpers/GradientMap";
import GradientMapLegend from "../GradientMapLegend";
import ColorKeyLegend from "../ColorKeyLegend";

import BarChart, { type BarChartDataEntry } from "../DataDisplays/BarChart";
import GeoUnitBubbleChart from "../DataDisplays/GeoUnitBubbleChart";
import { FACT_VIEW_CONFIGURATIONS, ID_SELECTION_PROVISIONAL_BALLOT, ID_SELECTION_ACTIVE_VOTERS, ID_SELECTION_POLLBOOK_DELETION, ID_SELECTION_MAIL_BALLOT_REJECTIONS, ID_SELECTION_REJECTED_BALLOTS, ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE, ID_SELECTION_VOTING_EQUIPMENT_BY_AGE, ID_SELECTION_VOTING_EQUIPMENT_SUMMARY, ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES, ID_SELECTION_MAIL_IN_VOTING, ID_SELECTION_VIEW_CVAP_INFO, ID_SELECTION_VIEW_CVAP_PERCENTAGE, ID_SELECTION_VOTER_REGISTRATION, ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE, ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_GINGLES_CHART, ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_VOTING_EQUIPMENT, ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_REJECTED_BALLOTS, STATE_INFORMATION_VIEW_TYPE_SIMPLE, STATE_INFORMATION_VIEW_TYPE_OVERLAY, type StateInformationViewOverlayView, type StateInformationViewSimpleFactView } from "./dataViewModeConfig";
import EquipmentGradientSet from "./EquipmentGradientSet";

const defaultDropDownSections = [
  {
    title: "Ballot Data",
    iconComponent: <BallotIcon />,
    items: [
      { id: ID_SELECTION_PROVISIONAL_BALLOT, iconComponent: <InboxIcon />, textContent: "Provisional Ballots" },
      { id: ID_SELECTION_ACTIVE_VOTERS, iconComponent: <PersonIcon />, textContent: "Active Voters" },
      { id: ID_SELECTION_POLLBOOK_DELETION, iconComponent: <DeleteForeverIcon />, textContent: "Pollbook Deletions" },
      { id: ID_SELECTION_MAIL_BALLOT_REJECTIONS, iconComponent: <PersonOffIcon />, textContent: "Mail Ballot Rejections" },
      { id: ID_SELECTION_REJECTED_BALLOTS, iconComponent: <DoNotDisturbIcon />, textContent: "Rejected Ballots vs. Equipment Quality" },
    ],
  },
  {
    title: "Voting Equipment",
    items: [
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE, iconComponent: <ScannerIcon />, textContent: "By Type" },
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_AGE, iconComponent: <AccessTimeIcon />, textContent: "By Age" },
      { id: ID_SELECTION_VOTING_EQUIPMENT_SUMMARY, iconComponent: <ScannerIcon />, textContent: "Summary" },
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
      { id: ID_SELECTION_MAIL_IN_VOTING, iconComponent: <HowToVoteIcon />, textContent: "Mail-In Voting Chart" },
      { id: ID_SELECTION_REJECTED_BALLOTS, iconComponent: <DoNotDisturbIcon />, textContent: "Rejected Ballots vs. Equipment Quality" },
    ],
  },
  {
    title: "Voting Equipment",
    items: [
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE, iconComponent: <AccessTimeIcon />, textContent: "By Type" },
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_AGE, iconComponent: <ScannerIcon />, textContent: "By Age" },
      { id: ID_SELECTION_VOTING_EQUIPMENT_SUMMARY, iconComponent: <ScannerIcon />, textContent: "Summary" },
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

const ecologicalInferenceDropDownSections = [
  {
    title: "Ecological Inference",
    items: [
      { id: ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_GINGLES_CHART, iconComponent: <PersonIcon />, textContent: "Gingles Chart" },
      { id: ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_VOTING_EQUIPMENT, iconComponent: <ScannerIcon />, textContent: "Equipment Accessibility" },
      { id: ID_SELECTION_VIEW_ECOLOGICAL_INFERENCE_REJECTED_BALLOTS, iconComponent: <PersonOffIcon />, textContent: "CVAP Rejections" },
    ],
  },
];

function pickDropdownType(stateType: DetailStateType[]) {
  const partyState = stateType.some((x) => x === DETAIL_STATE_TYPE_REPUBLICAN || x === DETAIL_STATE_TYPE_DEMOCRAT);
  const voterRegistrationState = stateType.some((x) => x === DETAIL_STATE_TYPE_VOTER_REGISTRATION);
  const preclearanceState = stateType.some((x) => x === DETAIL_STATE_TYPE_PRECLEARANCE_STATE);
  let result = [...defaultDropDownSections];
  if (partyState || voterRegistrationState) {
    if (partyState) {
      result[0] = partyStateDropDownSections[0];
      result[2] = partyStateDropDownSections[2];
    }
    if (voterRegistrationState) {
      result[2] = voterRegistrationStateDropDownSections[2];
    }
    if (preclearanceState) {
      result = result.concat(ecologicalInferenceDropDownSections);
    }
    return result;
  }
  return result;
}

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
  const configuration = FACT_VIEW_CONFIGURATIONS[id];
  if (configuration) {
    return `/state/${fipsCode}/${configuration.path}`;
  }
  return "?";
}

function determineInitialStateBasedOnUrl(pathname: string) {
  for (const [id, config] of Object.entries(FACT_VIEW_CONFIGURATIONS)) {
    if (pathname.includes(config.path)) {
      return Number(id);
    }
  }
  return ID_SELECTION_PROVISIONAL_BALLOT;
}

function StateInformationView() {
  const { fipsCode } = useParams();
  const navigate = useNavigate();
  const stateType = getDetailStateType(fipsCode!);
  const location = useLocation();
  const activeDataStateHook = useState(determineInitialStateBasedOnUrl(location.pathname));

  /* NOTE(jerry): size tuning parameters */
  const boxMarginTop = "1.2vh";
  const selectionDrawerWidth = "16.2em";
  const maxWidthForMap = "40vw";
  const heightUsage = "95vh";
  const maxHeightForMap = heightUsage;
  const remainingWidthAfterSelectionDrawer = useCssCalc(`calc(100vw - (${selectionDrawerWidth} + 1.2em + ${maxWidthForMap} + 1vw))`);
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
  const [cvapDemographicSelection, setCvapDemographicSelection] = useState(0);

  const tryingToViewDetailedVoterRegistration =
    stateType.some((x) => x === DETAIL_STATE_TYPE_VOTER_REGISTRATION) && activeDataState === ID_SELECTION_VOTER_REGISTRATION;

    const overlayViews = Object.values(FACT_VIEW_CONFIGURATIONS).filter(cfg => cfg.description.type === STATE_INFORMATION_VIEW_TYPE_OVERLAY);
    const shouldOpenPopup = overlayViews.some(cfg => location.pathname.includes(cfg.path));

  useEffect(
    function () {
      (async function () {
        const viewConfig = FACT_VIEW_CONFIGURATIONS[activeDataState];
        if (viewConfig && viewConfig.description.type == STATE_INFORMATION_VIEW_TYPE_SIMPLE) {
          const description = viewConfig.description;
          setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - ${description.barGraphTitle}`);
          setBarGraphXTitle(`${description.barGraphXTitle}`);
          setDataColumns(description.dataColumnSet);

          console.log(description.rowDataGenerators);
          const rowDataSet = await Promise.all(description.rowDataGenerators.map((f) => f(fipsCode!, { aggregate: false })));
          
          // Aggregated data rows are exactly 1 entry
          // for uniformity in the endpoint (so that it can share the same endpoint as the per-county variant.)
          const aggregatedDataSet = await Promise.all(
            description.rowDataGenerators.map((f) => f(fipsCode!, { aggregate: true }))
          );
          console.log("BEFORE PROCESS", rowDataSet, aggregatedDataSet);

          // All EAVS "facts" have the same length, which is the amount of counties of
          // that state.
          // For each county, then for each corresponding row in each query.
          const rowData = rowDataSet[0].map((_, i) =>
            rowDataSet.reduce((acc, entry) => ({ ...acc, ...entry[i] }), {})
          ).map((x: EAVsGeneralFact) => ({ id: x.fullRegionId, ...x }));

          const aggregatedData = aggregatedDataSet.reduce(
            (acc, entry) => ({ ...acc, ...entry[0] }),
            {}
          );

          console.log(rowData, aggregatedData);
          setBarData(description.barDataGenerator(aggregatedData));
          setDataRows(rowData);
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
    if (FACT_VIEW_CONFIGURATIONS[activeDataState].description.type != STATE_INFORMATION_VIEW_TYPE_SIMPLE) {
      return null;
    }

    const viewConfig = FACT_VIEW_CONFIGURATIONS[activeDataState].description as StateInformationViewSimpleFactView;
    const { properties } = feature;
    const fullRegionId = (properties!.STATEFP as string) + (properties!.COUNTYFP as string) + "00000";
    const row = dataRows.find((r) => r.fullRegionId === fullRegionId);

    let colorPoint: number | null = null;
    if (row) {
      let [dataEntry, dataEntryTotal] = viewConfig.ratioGenerator(row, cvapDemographicSelection);
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
      <EquipmentGradientSet dataRows={dataRows}/>
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

              if (stateType.some((x) => x !== DETAIL_STATE_TYPE_VOTER_REGISTRATION)) {
                return;
              }

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
                <ColorKeyLegend colors={VOTING_EQUIPMENT_TYPE_COLORS.map((x) => x.color)} labels={VOTING_EQUIPMENT_TYPE_COLORS.map((x) => x.text)} />
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
                paddingTop: "0.2em",
                background: "white",
                borderRadius: "0 3px 0 0",
                color: "black",
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
            {overlayViews.map((v) => 
            <Route path={v.matcher || v.path}
             element = {
                (v.description as StateInformationViewOverlayView).element?.(fipsCode!, bubbleChartWidth, bubbleChartHeight)
             }/>)}
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
