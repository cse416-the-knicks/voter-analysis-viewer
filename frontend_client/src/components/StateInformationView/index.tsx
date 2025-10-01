import type { GridColDef } from '@mui/x-data-grid';

import { useNavigate } from 'react-router';
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

import { useMap } from "react-leaflet";
import useKeyDown from '../../hooks/useKeyDown';

import { gradientMapNearest, gradientMapPoints } from "../../helpers/GradientMap";

import {
  Box,
  Paper,
  Typography
} from '@mui/material';

import {
  getDetailStateType
} from '../FullBoundedUSMap/detailedStatesInfo';

import { useEffect, useState } from 'react';

import styles from './StateInformationView.module.css';
import StateMap from '../StateMap';

import { FIPS_TO_STATES_MAP } from '../FullBoundedUSMap/boundaryData';
import { mockData, activeVoterData, provisionalBallotData, pollbookDeletionData, mailBallotRejectionData } from '../DataDisplays/DisplayData';
import BubbleChart from '../DataDisplays/BubbleChart';
import { StateInformationViewDrawer } from './StateInformationViewDrawer';
import BarChart from '../DataDisplays/BarChart';


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

const activeVoterColumns: GridColDef<(typeof activeVoterRows)[number]>[] = [
  { field: 'county', headerName: 'County', width: 120 },
  { field: 'ActiveVoters', headerName: 'Active Voters', type: 'number', width: 120 },
  { field: 'InactiveVoters', headerName: 'Inactive Voters', type: 'number', width: 120 },
  { field: 'TotalVoters', headerName: 'Total Voters', type: 'number', width: 120 },
];

const activeVoterRows = [
  {
    id: "TX-Harris",
    county: "Harris County",
    ActiveVoters: 2200000,
    InactiveVoters: 180000,
    TotalVoters: 2380000
  },
  {
    id: "TX-Dallas",
    county: "Dallas County",
    ActiveVoters: 1750000,
    InactiveVoters: 150000,
    TotalVoters: 1900000
  },
  {
    id: "TX-Tarrant",
    county: "Tarrant County",
    ActiveVoters: 1600000,
    InactiveVoters: 120000,
    TotalVoters: 1720000
  },
  {
    id: "TX-Travis",
    county: "Travis County",
    ActiveVoters: 1200000,
    InactiveVoters: 90000,
    TotalVoters: 1290000
  },
  {
    id: "TX-Bexar",
    county: "Bexar County",
    ActiveVoters: 1350000,
    InactiveVoters: 110000,
    TotalVoters: 1460000
  }
];

const pollbookDeletionColumns: GridColDef<(typeof pollbookDeletionRows)[number]>[] = [
  { field: 'county', headerName: 'County', width: 120 },
  { field: 'PollbookDeletions', headerName: 'Pollbook Deletions', type: 'number', width: 140 },
  { field: 'RemainingVoters', headerName: 'Remaining Voters', type: 'number', width: 140 },
  { field: 'TotalVoters', headerName: 'Total Voters', type: 'number', width: 120 },
];

const pollbookDeletionRows = [
  {
    id: "TX-Harris",
    county: "Harris County",
    PollbookDeletions: 45000,
    RemainingVoters: 2335000,
    TotalVoters: 2380000
  },
  {
    id: "TX-Dallas",
    county: "Dallas County",
    PollbookDeletions: 38000,
    RemainingVoters: 1862000,
    TotalVoters: 1900000
  },
  {
    id: "TX-Tarrant",
    county: "Tarrant County",
    PollbookDeletions: 29000,
    RemainingVoters: 1691000,
    TotalVoters: 1720000
  },
  {
    id: "TX-Travis",
    county: "Travis County",
    PollbookDeletions: 21000,
    RemainingVoters: 1269000,
    TotalVoters: 1290000
  },
  {
    id: "TX-Bexar",
    county: "Bexar County",
    PollbookDeletions: 22000,
    RemainingVoters: 1438000,
    TotalVoters: 1460000
  }
];

const mailBallotRejectionColumns: GridColDef<(typeof mailBallotRejectionRows)[number]>[] = [
  { field: 'county', headerName: 'County', width: 120 },
  { field: 'RejectedMailBallots', headerName: 'Rejected Mail Ballots', type: 'number', width: 160 },
  { field: 'AcceptedMailBallots', headerName: 'Accepted Mail Ballots', type: 'number', width: 160 },
  { field: 'TotalMailBallots', headerName: 'Total Mail Ballots', type: 'number', width: 140 },
];

const mailBallotRejectionRows = [
  {
    id: "TX-Harris",
    county: "Harris County",
    RejectedMailBallots: 15000,
    AcceptedMailBallots: 2235000,
    TotalMailBallots: 2250000
  },
  {
    id: "TX-Dallas",
    county: "Dallas County",
    RejectedMailBallots: 12000,
    AcceptedMailBallots: 1888000,
    TotalMailBallots: 1900000
  },
  {
    id: "TX-Tarrant",
    county: "Tarrant County",
    RejectedMailBallots: 9000,
    AcceptedMailBallots: 1711000,
    TotalMailBallots: 1720000
  },
  {
    id: "TX-Travis",
    county: "Travis County",
    RejectedMailBallots: 7000,
    AcceptedMailBallots: 1282000,
    TotalMailBallots: 1290000
  },
  {
    id: "TX-Bexar",
    county: "Bexar County",
    RejectedMailBallots: 8000,
    AcceptedMailBallots: 1458000,
    TotalMailBallots: 1460000
  }
];

function getColumnData(n) {
  if (n == 0) {
    return columns;
  }
  else if (n == 1) {
    return activeVoterColumns;
  }
  else if (n == 2) {
    return pollbookDeletionColumns;
  }

  return mailBallotRejectionColumns;
}

function getRowData(n) {
  if (n == 0) {
    return rows;
  }
  else if (n == 1) {
    return activeVoterRows;
  }
  else if (n == 2) {
    return pollbookDeletionRows;
  }

  return mailBallotRejectionRows;
}

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
  0:     "hsl(288, 10%, 80%)",   // very pale purple
  1000:  "hsl(288, 20%, 78%)",
  2000:  "hsl(288, 30%, 76%)",
  3000:  "hsl(288, 40%, 74%)",
  4000:  "hsl(288, 50%, 72%)",
  5000:  "hsl(288, 60%, 70%)",
  6000:  "hsl(288, 70%, 68%)",
  7000:  "hsl(288, 80%, 66%)",
  8000:  "hsl(288, 90%, 64%)",
  9000:  "hsl(288, 95%, 62%)",
  10000: "hsl(288, 100%, 60%)",  // full, vibrant purple
};
;

function MapLegend() {
  const leafletMap = useMap();

  useEffect(() => {
    if (!leafletMap) return;

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      const toggleButton = L.DomUtil.create("button", "toggleHider", div);
      toggleButton.textContent = "collapse legend";
      toggleButton.style.padding = "2px";
      toggleButton.style.margin = "0";
      toggleButton.style.marginBottom = "8px";
      toggleButton.style.background = "hsl(288, 100%, 45%)";
      toggleButton.style.color = "white";

      // White background + padding + rounded corners
      div.style.background = "white";
      div.style.padding = "8px";
      div.style.borderRadius = "6px";
      div.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";

      const subDiv = L.DomUtil.create("div", "", div);
      subDiv.style.overflow = "hidden";

      toggleButton.onclick = function() {
	if (subDiv.style.maxHeight !== '0px') {
	  subDiv.style.maxHeight = "0px";
	  toggleButton.style.marginBottom = "0";
	  toggleButton.textContent = "show legend";
	} else {
	  subDiv.style.maxHeight = "unset";
	  toggleButton.style.marginBottom = "8px";
	  toggleButton.textContent = "collapse legend";
	}
      }
      // Get the grades for the legend
      const grades = gradientMapPoints(GradientMap0);

      for (let i = 0; i < grades.length; i++) {
        const from = grades[i];
        const to = grades[i + 1];
        const color = gradientMapNearest(from, GradientMap0);

        subDiv.innerHTML += `
          <span style="margin: auto; height: 5px; display:flex;">
          <i style="
            background:${color};
            width:18px;
            height:18px;
            display:inline-block;
            margin-right:8px;
	    opacity:0.9;
            border: 1.5px solid black;
          "></i>
<b>${from}${to ? `&ndash;${to}` : "+"}</b>
</span><br/>
	`;
      }

      return div;
    };

    legend.addTo(leafletMap);

    // Cleanup on unmount
    return () => legend.remove();
  }, [leafletMap]);

  return null;
}

function StateInformationView() {
  const { fipsCode } = useParams();
  const activeDataStateHook = useState(0);
  const navigate = useNavigate();
  
  useKeyDown('Escape', () => navigate('/'));

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

  const stateType = getDetailStateType(fipsCode!);
  function styleFunction(feature: GeoJSON.Feature) {
    const geoUnitFipsCode = (activeDataStateHook[0] + activeDataStateHook[0] + feature.properties.STATEFP+feature.properties.COUNTYFP + activeDataStateHook[0]) as string;
    const result = {
	fillColor: "#00000000",
	fillOpacity: 0,
	color: "darkblue",
	weight: 1,
    };

    if (stateType !== "DETAIL_STATE_TYPE_NONE") {
      const randomNumber = getRandomInteger(geoUnitFipsCode, 0, 10000);
      const gradientMapNearestColor = gradientMapNearest(randomNumber, GradientMap0);
      result.fillColor = gradientMapNearestColor;
      result.fillOpacity = 1.0;
    } else {
      result.fillColor = "hsl(288, 90%, 64%)";
      result.fillOpacity = 0.5;
    }
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
  width={"600px"} height={"830px"} fipsCode={fipsCode}>
  {stateType !== "DETAIL_STATE_TYPE_NONE" && <MapLegend/>}
	</StateMap>
	</Paper>
      </Stack>
      <Stack spacing={3} sx={{ mt: 2, ml: 4, height: "50%", width: "50%" }}>
	<DataGrid
	  rows={getRowData(activeDataStateHook[0])}
	  columns={getColumnData(activeDataStateHook[0])}
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
        <BarChart stateInfo={getData(activeDataStateHook[0])[stateType]}/>
      </Paper>
      </Stack>
    </div>
  );
}

export default StateInformationView;
