import type { GridColDef } from "@mui/x-data-grid";
import type {
  PollbookDeletionStatisticsModel,
  ProvisionalBallotStatisticsModel,
  VoterRegistrationStatisticsModel,
  MailBallotRejectionStatisticsModel,
  VoterRegistrationHistoryGraphDataModel,
} from "../../api/client";

import {
  getProvisionalBallots,
  getMailBallotRejections,
  getVoterRegistrationCounts,
  getPollbookDeletions,
  getVoterRegistrationHistory,
} from "../../api/client";

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

import { Box, Paper, Typography, useTheme, Backdrop, Grow, Tabs, Tab } from "@mui/material";

import { DETAIL_STATE_TYPE_NONE, DETAIL_STATE_TYPE_VOTER_REGISTRATION, getDetailStateType } from "../FullBoundedUSMap/detailedStatesInfo";

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
  MAIL_BALLOT_REJECTION_COLUMNS,
  PROVISIONAL_BALLOT_COLUMNS,
} from "./dataColumns";

import FullScreenDetailedVoterRegistrationTable from "../FullScreenDetailedVoterRegistrationTable";

import { gradientMapNearest, type GradientMap } from "../../helpers/GradientMap";
import GradientMapLegend from "../GradientMapLegend";

import { dropBoxData, equipmentQualityData } from "../DataDisplays/PartyStatesMockData";
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
const ID_SELECTION_DROP_BOX_VOTING = 7;

const ID_SELECTION_VOTER_REGISTRATION = 8;
const ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE = 9;

const defaultDropDownSections = [
  {
    title: "Ballot Data",
    iconComponent: <BallotIcon />,
    items: [
      { id: ID_SELECTION_PROVISIONAL_BALLOT, iconComponent: <InboxIcon />, textContent: "Provisional Ballots" },
      { id: ID_SELECTION_ACTIVE_VOTERS, iconComponent: <PersonIcon />, textContent: "Active Voters" },
      { id: ID_SELECTION_POLLBOOK_DELETION, iconComponent: <DeleteForeverIcon />, textContent: "Pollbook Deletions" },
      { id: ID_SELECTION_MAIL_BALLOT_REJECTIONS, iconComponent: <PersonOffIcon />, textContent: "Mail Ballot Rejections" },
      { id: ID_SELECTION_DROP_BOX_VOTING, iconComponent: <HowToVoteIcon />, textContent: "Drop Box Voting" },
      { id: ID_SELECTION_REJECTED_BALLOTS, iconComponent: <DoNotDisturbIcon />, textContent: "Rejected Ballots" },
    ],
  },
  {
    title: "Voting Equipment",
    items: [
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_AGE, iconComponent: <ScannerIcon />, textContent: "By Type" },
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE, iconComponent: <AccessTimeIcon />, textContent: "By Age" },
    ],
  },
];

const choroplethColorBuckets = [
  "hsl(288, 10%, 80%)",
  "hsl(288, 20%, 78%)",
  "hsl(288, 30%, 76%)",
  "hsl(288, 40%, 74%)",
  "hsl(288, 50%, 72%)",
  "hsl(288, 60%, 70%)",
  "hsl(288, 70%, 68%)",
  "hsl(288, 80%, 66%)",
  "hsl(288, 90%, 64%)",
  "hsl(288, 95%, 62%)",
  "hsl(288, 100%, 60%)", // full, vibrant purple
];

type EAVsGeneralFact =
  | ProvisionalBallotStatisticsModel
  | PollbookDeletionStatisticsModel
  | MailBallotRejectionStatisticsModel
  | VoterRegistrationStatisticsModel;

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function StateInformationView() {
  const { fipsCode } = useParams();
  const activeDataStateHook = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const stateType = getDetailStateType(fipsCode!);
  const location = useLocation();
  const choroplethScaleFactor = 0.05;

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

  const tryingToViewDetailedVoterRegistration = stateType === DETAIL_STATE_TYPE_VOTER_REGISTRATION && activeDataState === ID_SELECTION_VOTER_REGISTRATION;

  const shouldOpenPopup = ["dropbox-chart", "rejected-ballots-chart", "voter-table", "compare-voter-registration-rates"].some((x) =>
    location.pathname.includes(x)
  );

  const dropDownSections = [...defaultDropDownSections];
  if (stateType == DETAIL_STATE_TYPE_VOTER_REGISTRATION) {
    dropDownSections.push({
      title: "Voter Registration",
      items: [
        { id: ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES, iconComponent: <PersonIcon />, textContent: "Registration by Year" },
        { id: ID_SELECTION_VOTER_REGISTRATION, iconComponent: <PersonIcon />, textContent: "Registration Data" },
        { id: ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE, iconComponent: <PersonIcon />, textContent: "Registered Voters" },
      ],
    });
  } else {
    dropDownSections.push({
      title: "Voter Registration",
      items: [{ id: ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES, iconComponent: <PersonIcon />, textContent: "Registration by Year" }],
    });
  }

  useEffect(
    function () {
      (async function () {
        let high: number = 0;
        switch (activeDataState) {
          case ID_SELECTION_PROVISIONAL_BALLOT:
            {
              navigate(`/state/${fipsCode!}/`);
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
              console.log(PROVISIONAL_BALLOT_COLUMNS);
              setBarData(bargraphDataForProvisionalBallots(aggregatedData[0]));
              high = Math.max(...data.map((x) => x.totalProvisionalBallotsCast!));
              setTotalDataCount(aggregatedData[0].totalProvisionalBallotsCast!);
            }
            break;
          case ID_SELECTION_MAIL_BALLOT_REJECTIONS:
            {
              navigate(`/state/${fipsCode!}/`);
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
              high = Math.max(...data.map((x) => x.rejectTotal!));
              setTotalDataCount(aggregatedData[0].rejectTotal!);
            }
            break;
          case ID_SELECTION_ACTIVE_VOTERS:
            {
              navigate(`/state/${fipsCode!}/`);
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
              high = Math.max(...data.map((x) => x.total!));
              setTotalDataCount(aggregatedData[0].total!);
            }
            break;
          case ID_SELECTION_POLLBOOK_DELETION:
            {
              navigate(`/state/${fipsCode!}/`);
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
              high = Math.max(...data.map((x) => x.totalRemoved!));
              setTotalDataCount(aggregatedData[0].totalRemoved!);
            }
            break;
          case ID_SELECTION_VOTER_REGISTRATION:
            {
              navigate(`/state/${fipsCode!}/`);
              // TODO(jerry): add the endpoint to
              // fill in the data from...
            }
            break;
          case ID_SELECTION_COMPARE_VOTER_REGISTRATION_RATES:
            {
              navigate(`/state/${fipsCode}/compare-voter-registration-rates/`);
            }
            break;
          case ID_SELECTION_REJECTED_BALLOTS:
            {
              navigate(`/state/${fipsCode}/rejected-ballots-chart/`);
            }
            break;
          case ID_SELECTION_DROP_BOX_VOTING:
            {
              navigate(`/state/${fipsCode}/dropbox-chart/`);
            }
            break;
          case ID_SELECTION_VOTER_REGISTRATION_SHOW_VOTER_TABLE:
            {
              navigate(`/state/${fipsCode}/voter-table/`);
            }
            break;
          default:
            {
              // not handled yet.
            }
            break;
        }

        const newGradientMap: GradientMap = {};
        const binSize = 10;
        for (let i = 0; i < choroplethColorBuckets.length; ++i) {
          newGradientMap[binSize * i] = choroplethColorBuckets[i];
        }
        setGradientMap(newGradientMap);
      })();
    },
    [activeDataState, fipsCode, navigate]
  );

  useKeyDown("Escape", () => navigate("/"));

  const styleFunction = (feature: GeoJSON.Feature) => {
    const { properties } = feature;
    const fullRegionId = (properties!.STATEFP as string) + (properties!.COUNTYFP as string) + "00000";
    const style = {
      color: theme.palette.secondary.main,
      fillColor: theme.palette.secondary.main,
      fillOpacity: 0.5,
      weight: 2.5,
    };

    if (stateType !== DETAIL_STATE_TYPE_NONE) {
      const row = dataRows.find((r) => r.fullRegionId === fullRegionId);
      if (row) {
        console.log(row);
        const dataEntry =
          (row as MailBallotRejectionStatisticsModel).rejectTotal! ||
          (row as ProvisionalBallotStatisticsModel).totalProvisionalBallotsCast! ||
          (row as PollbookDeletionStatisticsModel).totalRemoved! ||
          (row as VoterRegistrationStatisticsModel).active!;
        const dataEntryTotal =
          (row as MailBallotRejectionStatisticsModel).totalBallotsByMail! ||
          (row as ProvisionalBallotStatisticsModel).totalBallotsCast! || // TODO(jerry): needs total actual ballots vs total Provisional
          (row as PollbookDeletionStatisticsModel).totalRegisteredVoters! ||
          (row as VoterRegistrationStatisticsModel).total!;
        const colorPoint = (dataEntry / dataEntryTotal) * 100;

        style.fillOpacity = 1.0;
        style.fillColor = gradientMapNearest(colorPoint, gradientMap);
      }

      if (tryingToViewDetailedVoterRegistration && viewDetailedVoterRegistrationBubbleChart) {
        style.fillOpacity = 0;
        style.weight = 1;
      }
    }

    return style;
  };

  return (
    <div
      className={styles.stateInformationPopup}
      style={{
        left: `calc(${selectionDrawerWidth} + 1.5em)`,
      }}
    >
      <StateInformationViewDrawer
        stateHook={activeDataStateHook}
        sections={dropDownSections}
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
            styleFunction={styleFunction}
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
            {stateType !== DETAIL_STATE_TYPE_NONE && !(tryingToViewDetailedVoterRegistration && viewDetailedVoterRegistrationBubbleChart) && (
              <GradientMapLegend gradientMap={gradientMap} />
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
              path="dropbox-chart"
              element={
                <BubbleChart
                  data={dropBoxData}
                  width={bubbleChartWidth}
                  height={bubbleChartHeight}
                  title="Drop Box Voting by Party"
                  xAxisLabel="Republican Votes (%)"
                  yAxisLabel="Drop Box Voting (%)"
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
