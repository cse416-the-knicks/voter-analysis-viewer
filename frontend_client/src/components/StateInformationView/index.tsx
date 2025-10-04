import type { GridColDef } from '@mui/x-data-grid';
import { 
  type PollbookDeletionStatisticsModel,
  type ProvisionalBallotStatisticsModel, 
  type VoterRegistrationStatisticsModel,
  type MailBallotRejectionStatisticsModel,
  getProvisionalBallots,
  getMailBallotRejections,
  getVoterRegistrationCounts,
  getPollbookDeletions,
} from '../../api/client';

import { useParams, useNavigate } from 'react-router';
import InboxIcon from '@mui/icons-material/Inbox';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BallotIcon from '@mui/icons-material/Ballot';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ScannerIcon from '@mui/icons-material/Scanner';
import Stack from '@mui/material/Stack';

import {
  Box,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';

import {
  getDetailStateType
} from '../FullBoundedUSMap/detailedStatesInfo';

import { useState, useEffect } from 'react';

import styles from './StateInformationView.module.css';
import StateMap from '../StateMap';

import { FIPS_TO_STATES_MAP } from '../FullBoundedUSMap/boundaryData';
import { StateInformationViewDrawer } from './StateInformationViewDrawer';
import BarChart, { type BarChartDataEntry } from '../DataDisplays/BarChart';
import useKeyDown from '../../hooks/useKeyDown';
import StyledDataGrid from '../StyledDataGrid';

import {
  ACTIVE_VOTER_REGISTRATION_COLUMNS,
  bargraphDataForActiveVoterRegistrations,
  bargraphDataForMailBallotRejections,
  bargraphDataForPollBookDeletions,
  bargraphDataForProvisionalBallots,
  MAIL_BALLOT_REJECTION_COLUMNS,
  POLL_BOOK_DELETION_COLUMNS,
  PROVISIONAL_BALLOT_COLUMNS
} from './dataColumns';

const ID_SELECTION_PROVISIONAL_BALLOT = 0;
const ID_SELECTION_ACTIVE_VOTERS = 1;
const ID_SELECTION_POLLBOOK_DELETION = 2;
const ID_SELECTION_MAIL_BALLOT_REJECTIONS = 3;

const ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE = 4;
const ID_SELECTION_VOTING_EQUIPMENT_BY_AGE = 5;

const dropDownSections = [
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
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_AGE, iconComponent: <ScannerIcon />, textContent: "By Type" },
      { id: ID_SELECTION_VOTING_EQUIPMENT_BY_TYPE, iconComponent: <AccessTimeIcon />, textContent: "By Age" },
    ],
  }
];

type EAVsGeneralFact = ProvisionalBallotStatisticsModel | 
  PollbookDeletionStatisticsModel | 
  MailBallotRejectionStatisticsModel | 
  VoterRegistrationStatisticsModel;

function StateInformationView() {
  const { fipsCode } = useParams();
  const activeDataStateHook = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();

  const maxWidthForTable = 850;
  const maxHeightForTable = 500;
  const maxWidthForMap = "700px";
  const maxHeightForMap = "900px";

  const activeDataState = activeDataStateHook[0];
  const [dataCols, setDataColumns] = useState<GridColDef<EAVsGeneralFact[]>[]>([]);
  const [dataRows, setDataRows] = useState<EAVsGeneralFact[]>([]);
  const [barData, setBarData] = useState<BarChartDataEntry[]>([]);
  const [barGraphTitle, setBarGraphTitle] = useState<string>("");
  const [barGraphXTitle, setBarGraphXTitle] = useState<string>("");

  useEffect(
    function () {(async function() {
      switch (activeDataState) {
        case ID_SELECTION_PROVISIONAL_BALLOT: {
          const promises = [true, false].map((v) => getProvisionalBallots(fipsCode!, { aggregate: v }));
          const [aggregatedData, data] = await Promise.all(promises);
          setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - Provisional Ballots`);
          setBarGraphXTitle("Ballots Cast");
          setDataRows(data.map((x) => {return {id: x.fullRegionId,...x}}));
          setDataColumns(PROVISIONAL_BALLOT_COLUMNS);
          setBarData(bargraphDataForProvisionalBallots(aggregatedData[0]));
        } break;
        case ID_SELECTION_MAIL_BALLOT_REJECTIONS: {
          const promises = [true, false].map((v) => getMailBallotRejections(fipsCode!, { aggregate: v }));
          const [aggregatedData, data] = await Promise.all(promises);
          setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - Mail Ballots Rejection`);
          setBarGraphXTitle("Rejection Reasons");
          setDataRows(data.map((x) => {return {id: x.fullRegionId,...x}}));
          setDataColumns(MAIL_BALLOT_REJECTION_COLUMNS);
          setBarData(bargraphDataForMailBallotRejections(aggregatedData[0]));
        } break;
        case ID_SELECTION_ACTIVE_VOTERS: {
          const promises = [true, false].map((v) => getVoterRegistrationCounts(fipsCode!, { aggregate: v }));
          const [aggregatedData, data] = await Promise.all(promises);
          setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - Voter Registration Count`);
          setBarGraphXTitle("Voter Categories");
          setDataRows(data.map((x) => {return {id: x.fullRegionId,...x}}));
          setDataColumns(ACTIVE_VOTER_REGISTRATION_COLUMNS);
          setBarData(bargraphDataForActiveVoterRegistrations(aggregatedData[0]));
        } break;
        case ID_SELECTION_POLLBOOK_DELETION: {
          const promises = [true, false].map((v) => getPollbookDeletions(fipsCode!, { aggregate: v }));
          const [aggregatedData, data] = await Promise.all(promises);
          setBarGraphTitle(`${FIPS_TO_STATES_MAP[fipsCode!]} - Poll Book Deletions`);
          setBarGraphXTitle("Deletion Reasons");
          setDataRows(data.map((x) => {return {id: x.fullRegionId,...x}}));
          setDataColumns(POLL_BOOK_DELETION_COLUMNS);
          setBarData(bargraphDataForPollBookDeletions(aggregatedData[0]));
        } break;
        default: {
          // not handled yet.
        } break;
      }
    })();},
    [activeDataState]
  );

  useKeyDown("Escape", () => navigate("/"));

  const styleFunction =
    (feature: L.FeatureGroup) => {
      return {
        color: theme.palette.secondary.main,
        fillColor: theme.palette.secondary.main
      };
    }

  return (
    <div className={styles.stateInformationPopup}>
      <StateInformationViewDrawer
        stateHook={activeDataStateHook}
        sections={dropDownSections}
        stateType={getDetailStateType(fipsCode!)} />
      <Stack spacing={0} direction="column" sx={{ mt: 2.0, ml: 'auto' }}>
        <Paper
          sx={{
            mt: 0,
            ml: 'auto',
            width: maxWidthForMap,
            height: maxHeightForMap
          }}
          elevation={5}>
          <Typography variant="h3" component="h2">
            {FIPS_TO_STATES_MAP[fipsCode!]}
          </Typography>
          <StateMap
            // @ts-expect-error
            styleFunction={styleFunction}
            width={maxWidthForMap}
            height={maxHeightForMap}
            fipsCode={fipsCode} />
        </Paper>
      </Stack>
      <Stack spacing={0.2} sx={{ mt: 2, ml: 1.15, height: "50%", width: "50.5%" }}>
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
            <BarChart
              width={maxWidthForTable - 20}
              height={500}
              data={barData}
              title={barGraphTitle}
              xTitle={barGraphXTitle} />
          </Paper>
        </Box>
      </Stack>
    </div>
  );
}

export default StateInformationView;
