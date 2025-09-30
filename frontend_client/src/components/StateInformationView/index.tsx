import type { GridColDef } from '@mui/x-data-grid';

import { useParams } from 'react-router';
import { DataGrid } from '@mui/x-data-grid';
import InboxIcon from '@mui/icons-material/Inbox';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BallotIcon from '@mui/icons-material/Ballot';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ScannerIcon from '@mui/icons-material/Scanner';
import Stack from '@mui/material/Stack';

import { gradientMapNearest } from "../../helpers/GradientMap";

import {
  Box,
  Paper,
  Typography
} from '@mui/material';

import {
  getDetailStateType
} from '../FullBoundedUSMap/detailedStatesInfo';

import { useState } from 'react';

import styles from './StateInformationView.module.css';
import StateMap from '../StateMap';

import { FIPS_TO_STATES_MAP } from '../FullBoundedUSMap/boundaryData';
import { mockData, activeVoterData, provisionalBallotData, pollbookDeletionData, mailBallotRejectionData } from '../DataDisplays/DisplayData';
import BubbleChart from '../DataDisplays/BubbleChart';
import { StateInformationViewDrawer } from './StateInformationViewDrawer';
import BarChart from '../DataDisplays/BarChart';

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'county', headerName: 'County', width: 120 },
  { field: 'E2a', headerName: 'Voter Not on List', type: 'number', width: 100 },
  { field: 'E2b', headerName: 'Voter Lacked ID', type: 'number', width: 100 },
  { field: 'E2c', headerName: 'Challenged Eligibility', type: 'number', width: 100 },
  { field: 'E2d', headerName: 'Challenged Eligibility', type: 'number', width: 100 },
  { field: 'E2e', headerName: 'Not Resident', type: 'number', width: 100 },
  { field: 'E2f', headerName: 'Registration Not Updated', type: 'number', width: 100 },
  { field: 'E2g', headerName: 'Did Not Surrender Mail Ballot', type: 'number', width: 100 },
  { field: 'E2h', headerName: 'Judge Extended Voting Hours', type: 'number', width: 100 },
  { field: 'E2i', headerName: 'Voter Used SDR', type: 'number', width: 100 },
  { field: 'Other', headerName: 'Other', type: 'number', width: 100 },
  { field: 'Total', headerName: 'Total', type: 'number', width: 100 },
];

function getData(category) {
  if (category == 0) {
    return provisionalBallotData;
  } else if (category == 1) {
    return activeVoterData;
  } else if (category == 2) {
    return pollbookDeletionData;
  } else if (category == 3) {
    return mailBallotRejectionData;
  }

  return activeVoterData;
}

const rows = [
  {
    id: "TX-Harris",
    county: "Harris County",
    E2a: 300,
    E2b: 220,
    E2c: 100,
    E2d: 65,
    E2e: 150,
    E2f: 180,
    E2g: 120,
    E2h: 40,
    E2i: 55,
    Other: 90,
    Total: 1320
  },
  {
    id: "TX-Dallas",
    county: "Dallas County",
    E2a: 270,
    E2b: 200,
    E2c: 95,
    E2d: 60,
    E2e: 140,
    E2f: 160,
    E2g: 110,
    E2h: 35,
    E2i: 45,
    Other: 80,
    Total: 1195
  },
  {
    id: "TX-Tarrant",
    county: "Tarrant County",
    E2a: 250,
    E2b: 180,
    E2c: 85,
    E2d: 55,
    E2e: 130,
    E2f: 150,
    E2g: 100,
    E2h: 30,
    E2i: 40,
    Other: 70,
    Total: 1090
  },
  {
    id: "TX-Travis",
    county: "Travis County",
    E2a: 180,
    E2b: 130,
    E2c: 65,
    E2d: 40,
    E2e: 100,
    E2f: 120,
    E2g: 80,
    E2h: 25,
    E2i: 35,
    Other: 60,
    Total: 835
  },
  {
    id: "TX-Bexar",
    county: "Bexar County",
    E2a: 220,
    E2b: 160,
    E2c: 75,
    E2d: 50,
    E2e: 110,
    E2f: 140,
    E2g: 90,
    E2h: 28,
    E2i: 38,
    Other: 65,
    Total: 976
  }
];

// TODO(jerry): temp!!!
function getRandomInteger(seed: string, min: number, max: number): number {
  // Hash the seed string to a numeric value
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0; // unsigned 32-bit integer
  }

  // Linear Congruential Generator constants
  const a = 1664525;
  const c = 1013904223;
  const m = 2 ** 32;

  // Generate pseudo-random number
  h = (a * h + c) % m;

  // Normalize to 0..1
  const rand = h / m;

  // Scale to desired range
  return Math.floor(rand * (max - min + 1)) + min;
}

const GradientMap0 = {
  0:     "hsl(210, 10%, 80%)",  // very pale blue
  1000:  "hsl(210, 20%, 78%)",
  2000:  "hsl(210, 30%, 76%)",
  3000:  "hsl(210, 40%, 74%)",
  4000:  "hsl(210, 50%, 72%)",
  5000:  "hsl(210, 60%, 70%)",
  6000:  "hsl(210, 70%, 68%)",
  7000:  "hsl(210, 80%, 66%)",
  8000:  "hsl(210, 90%, 64%)",
  9000:  "hsl(210, 95%, 62%)",
  10000: "hsl(210, 100%, 60%)", // light but fully saturated blue
};

function StateInformationView() {
  const { fipsCode } = useParams();
  const activeDataStateHook = useState(0);

  const dropDownSections = [
    {
      title: "Ballot Data",
      iconComponent: <BallotIcon/>,
      items: [
	{ id: 0, iconComponent: <InboxIcon/>, textContent: "Provisional Ballots" },
	{ id: 1, iconComponent: <PersonIcon/>, textContent: "Active Voters" },
	{ id: 2, iconComponent: <DeleteForeverIcon/>, textContent: "Pollbook Deletions" },
	{ id: 3, iconComponent: <PersonOffIcon/>, textContent: "Mail Ballot Rejections" },
      ],
    },
    {
      title: "Voting Equipment",
      items: [
	{ id: 4, iconComponent: <ScannerIcon/>, textContent: "By Type" },
	{ id: 5, iconComponent: <AccessTimeIcon/>, textContent: "By Age" },
      ],
    }
  ];

  function styleFunction(feature: GeoJSON.Feature) {
    const geoUnitFipsCode = (activeDataStateHook[0] + activeDataStateHook[0] + feature.properties.STATEFP+feature.properties.COUNTYFP + activeDataStateHook[0]) as string;
    const result = {
	fillColor: "#00000000",
	fillOpacity: 0,
	color: "darkblue",
	weight: 1,
    };

    const randomNumber = getRandomInteger(geoUnitFipsCode, 0, 10000);
    const gradientMapNearestColor = gradientMapNearest(randomNumber, GradientMap0);
    result.fillColor = gradientMapNearestColor;
    result.fillOpacity = 1.0;
    return result;
  }

  // TODO: dynamically calculate height.
  return (
    <div className={styles.stateInformationPopup}>
      <Box>
	<StateInformationViewDrawer
	  stateHook={activeDataStateHook}
	  sections={dropDownSections}
	  stateType={getDetailStateType(fipsCode!)}/>
      </Box>

      <Stack spacing={3} direction="column" sx={{ mt: 4 }}>
	<Paper
	  sx={{ mt: 2, ml: 'auto', width: "600px", height: "860px" }}
	  elevation={5}>
	  <Typography variant="h3" component="h2">
	    {FIPS_TO_STATES_MAP[fipsCode!]}
	  </Typography>
	   {/* TODO(jerry): THIS IS WRONG! */}
	  <StateMap
  key={activeDataStateHook[0]}
  styleFunction={styleFunction}
  width={"600px"} height={"830px"} fipsCode={fipsCode}/>
	</Paper>
      </Stack>
      <Stack spacing={3} sx={{ mt: 2, ml: 4, height: "50%", width: "50%" }}>
	<DataGrid
	    rows={rows}
	    columns={columns}
	    initialState={{
	    pagination: {
		paginationModel: {
		pageSize: 7,
		},
	    },
	    }}
	    pageSizeOptions={[5]}
	    checkboxSelection
	    disableRowSelectionOnClick
	/>
      <Paper  elevation={5}>
        <BarChart stateInfo={getData(activeDataStateHook[0])[getDetailStateType(fipsCode!)]}/>
      </Paper>
      </Stack>
    </div>
  );
}

export default StateInformationView;
