import type { GridColDef } from '@mui/x-data-grid';

import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';
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
  getProvisionalBallots,
  getPollbookDeletions,
  getMailBallotRejections,
  getVoterRegistrationCounts,
  type ProvisionalBallotStatisticsModel
} from '../../api/client';

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
import BubbleChart from '../DataDisplays/BubbleChart';
import { StateInformationViewDrawer } from './StateInformationViewDrawer';
import BarChart from '../DataDisplays/BarChart';

const provisionColumns: GridColDef<(typeof rows)[number]>[] = [
    {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    renderHeader: () => <></>, // This hides the "Select All" checkbox
  },
  { field: 'countyName', headerName: 'County', width: 120 },
  { field: 'totalBallotsCast', headerName: 'Total Ballots Cast', type: 'number', width: 100 },
  { field: 'ballotReasonNotOnList', headerName: 'Not On List', type: 'number', width: 100 },
  { field: 'ballotReasonNoIdAvailable', headerName: 'No ID', type: 'number', width: 100 },
  { field: 'ballotReasonChallengedByOfficial', headerName: 'Challenged Official', type: 'number', width: 100 },
  { field: 'ballotReasonChallengedByOther', headerName: 'Challenged Other', type: 'number', width: 100 },
  { field: 'ballotReasonWrongPrecinct', headerName: 'Wrong Precinct', type: 'number', width: 100 },
  { field: 'ballotReasonNotUpdatedAddress', headerName: 'Not Updated Address', type: 'number', width: 100 },
  { field: 'ballotReasonDidNotSurrender', headerName: 'Did Not Surrender', type: 'number', width: 100 },
  { field: 'ballotReasonExtendedVotingHours', headerName: 'Extended Voter Hours', type: 'number', width: 100 },
  { field: 'balloReasonSameDayRegistration', headerName: 'Used SDR', type: 'number', width: 100 },
  { field: 'ballotReasonOther', headerName: 'Other', type: 'number', width: 100 },
];
const activeVoterColumns: GridColDef<(typeof rows)[number]>[] = [
    {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    renderHeader: () => <></>, // This hides the "Select All" checkbox
  },
  { field: 'countyName', headerName: 'County', width: 120 },
  { field: 'total', headerName: 'Total Voters Registered', type: 'number', width: 100 },
  { field: 'active', headerName: 'Active Voters', type: 'number', width: 100 },
  { field: 'inactive', headerName: 'Inactive Voters', type: 'number', width: 100 },
];
const pollbookColumns: GridColDef<(typeof rows)[number]>[] = [
    {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    renderHeader: () => <></>, // This hides the "Select All" checkbox
  },
  { field: 'countyName', headerName: 'County', width: 120 },
  { field: 'totalRemoved', headerName: 'Total Removals', type: 'number', width: 100 },
  { field: 'removedReasonMoved', headerName: 'Moved', type: 'number', width: 100 },
  { field: 'removedReasonDeceased', headerName: 'Deceased', type: 'number', width: 100 },
  { field: 'removedReasonFelony', headerName: 'Felony', type: 'number', width: 100 },
  { field: 'removedReasonFailedToConfirm', headerName: 'Failed To Confirm', type: 'number', width: 100 },
  { field: 'removedReasonIncompetent', headerName: 'Incompetent', type: 'number', width: 100 },
  { field: 'removedReasonRequested', headerName: 'Requested', type: 'number', width: 100 },
  { field: 'removedReasonDuplicate', headerName: 'Duplicate', type: 'number', width: 100 },
  { field: 'removedOther', headerName: 'Other', type: 'number', width: 100 },
];
const mailBallotRejectionColumns: GridColDef<(typeof rows)[number]>[] = [
    {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    renderHeader: () => <></>, // This hides the "Select All" checkbox
  },
  { field: 'countyName', headerName: 'County', width: 50 },
  { field: 'rejectTotal', headerName: 'Total Rejections', type: 'number', width: 50 },
  { field: 'rejectLate', headerName: 'Late', type: 'number', width: 100 },
  { field: 'rejectNoSignature', headerName: 'No Signature', type: 'number', width: 100 },
  { field: 'rejectNoWitnessSignature', headerName: 'No Witness Signature', type: 'number', width: 50 },
  { field: 'rejectSignatureMismatch', headerName: 'Signature Mismatch', type: 'number', width: 50 },
  { field: 'rejectUnofficialEnv', headerName: 'Unofficial Envelope', type: 'number', width: 50 },
  { field: 'rejectBallotMissing', headerName: 'Ballot Missing', type: 'number', width: 50 },
  { field: 'rejectNoSecrecyEnvironment', headerName: 'No Secrecy Envelope', type: 'number', width: 50 },
  { field: 'rejectMultipleInEnvironment', headerName: 'Multiple in Envelope', type: 'number', width: 50 },
  { field: 'rejectUnsealedEnvironment', headerName: 'Unsealed Envelope', type: 'number', width: 50 },
  { field: 'rejectNoPostMark', headerName: 'No Postmark', type: 'number', width: 50 },
  { field: 'rejectNoAddress', headerName: 'No Address', type: 'number', width: 50 },
  { field: 'rejectVoterDeceased', headerName: 'Voter Deceased', type: 'number', width: 50 },
  { field: 'rejectDuplicateVote', headerName: 'Duplicate Vote', type: 'number', width: 50 },
  { field: 'rejectMissingDocumentation', headerName: 'Missing Documentation', type: 'number', width: 50 },
  { field: 'rejectNotEligible', headerName: 'Not Eligible', type: 'number', width: 100 },
  { field: 'rejectNoApplication', headerName: 'No Application', type: 'number', width: 100 },
  { field: 'rejectOther', headerName: 'Other', type: 'number', width: 100 },
];


function getColumnData(n) {
  if (n == 0)
  return provisionColumns;
  if (n == 1)
    return activeVoterColumns;
  if (n == 2)
    return pollbookColumns;
  return mailBallotRejectionColumns;
}

;

function MapLegend({GradientMap0}) {
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

  const [ rowData, rowDataSet ] = useState<ProvisionalBallotStatisticsModel[]>([]);
  const [ barData, barDataSet ] = useState<any>(
    {
      stateName: "empty",
      XTitle: "empty",
      Title: "empty",
      data: [
      ],
    }
    ); // do not care
  const [rowSelectionModel, setRowSelectionModel] =
  useState<GridRowSelectionModel>({
    type: 'include', // or 'exclude'
    ids: new Set()
  });

  const [ GradientMap0, setGM] = useState<any>(
    {
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
    }
  );

  useEffect(
    function() {
      (async function () {
	const n = activeDataStateHook[0];
	
	  const ColorBuckets = [
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
	    "hsl(288, 100%, 60%)",  // full, vibrant purple
	  ]
	if (n == 0) {
	  const data = await getProvisionalBallots(fipsCode!, {aggregate: false});
	  const aggregateData = await getProvisionalBallots(fipsCode!, {aggregate: true});

	  const high = Math.max(... data.map((x) => x.totalBallotsCast))*0.85;
	  const bucketDiv = Math.ceil(high / ColorBuckets.length);
	  const newgm = {};
	  for (let i = 0; i < ColorBuckets.length; ++i) {
	    // close enough
	    newgm[(bucketDiv * i).toString()] = ColorBuckets[i];
	  }
	  setGM(newgm);
	  barDataSet({
	    stateName: FIPS_TO_STATES_MAP[fipsCode!],
	    XTitle: "Ballots Cast",
	    Title: "Provisional Ballots",
	    data: [
	      {category: "Total Ballots", value: aggregateData[0].totalBallotsCast},
	      {category: "Not On List", value: aggregateData[0].ballotReasonNotOnList},
	      {category: "No ID", value: aggregateData[0].ballotReasonNoIdAvailable},
	      {category: "Challenged Official", value: aggregateData[0].ballotReasonChallengedByOfficial},
	      {category: "Challenged Other", value: aggregateData[0].ballotReasonChallengedByOther},
	      {category: "Wrong Precinct", value: aggregateData[0].ballotReasonWrongPrecinct},
	      {category: "Not Updated Address", value: aggregateData[0].ballotReasonNotUpdatedAddress},
	      {category: "Did Not Surrender", value: aggregateData[0].ballotReasonDidNotSurrender},
	      {category: "Extended Voter Hours", value: aggregateData[0].ballotReasonExtendedVotingHours},
	      {category: "Used SDR", value: aggregateData[0].ballotReasonSameDayRegistration},
	      {category: "Other", value: aggregateData[0].ballotReasonOther},
	    ],
	  });
	  rowDataSet(data.map((x) => {return {id: x.fullRegionId,...x}}));
	} else if (n == 1) {
	  const data = await getVoterRegistrationCounts(fipsCode!, {aggregate: false});
	  const aggregateData = await getVoterRegistrationCounts(fipsCode!, {aggregate: true});

	  const high = Math.max(... data.map((x) => x.total))*0.85;
	  // const high = 10000;
	  const bucketDiv = Math.ceil(high / ColorBuckets.length);
	  const newgm = {};
	  for (let i = 0; i < ColorBuckets.length; ++i) {
	    // close enough
	    newgm[(bucketDiv * i).toString()] = ColorBuckets[i];
	  }
	  setGM(newgm);
	  barDataSet({
	    stateName: FIPS_TO_STATES_MAP[fipsCode!],
	    XTitle: "Voter Categories",
	    Title: "Voter Registration Count",
	    data: [
	      {category: "Total Voters", value: aggregateData[0].total},
	      {category: "Active Voters", value: aggregateData[0].active},
	      {category: "Inactive Voters", value: aggregateData[0].inactive},
	    ],
	  });
	  rowDataSet(data.map((x) => {return {id: x.fullRegionId,...x}}));
	} else if (n == 2) {
	  const data = await getPollbookDeletions(fipsCode!, {aggregate: false});
	  const aggregateData = await getPollbookDeletions(fipsCode!, {aggregate: true});

	  const high = Math.max(... data.map((x) => x.totalRemoved!))*0.85;
	  const bucketDiv = Math.ceil(high / ColorBuckets.length);
	  const newgm = {};
	  for (let i = 0; i < ColorBuckets.length; ++i) {
	    // close enough
	    newgm[(bucketDiv * i).toString()] = ColorBuckets[i];
	  }
	  setGM(newgm);
	  barDataSet({
	    stateName: FIPS_TO_STATES_MAP[fipsCode!],
	    XTitle: "Removal Reasons",
	    Title: "Pollbook Deletion",
	    data: [
	      {category: "Total", value: aggregateData[0].totalRemoved},
	      {category: "Moved", value: aggregateData[0].removedReasonMoved},
	      {category: "Deceased", value: aggregateData[0].removedReasonDeceased},
	      {category: "Felony", value: aggregateData[0].removedReasonFelony},
	      {category: "Failed to Confirm", value: aggregateData[0].removedReasonFailedToConfirm},
	      {category: "Incompetent", value: aggregateData[0].removedReasonIncompetent},
	      {category: "Requested", value: aggregateData[0].removedReasonRequested},
	      {category: "Duplicate", value: aggregateData[0].removedReasonDuplicate},
	      {category: "Other", value: aggregateData[0].removedOther},
	    ],
	  });
	  rowDataSet(data.map((x) => {return {id: x.fullRegionId,...x}}));
	} else if (n == 3) {
	  const data = await getMailBallotRejections(fipsCode!, { aggregate: false });
	  const aggregateData = await getMailBallotRejections(fipsCode!, { aggregate: true });

	  // bucket coloring, same as before
	  const high = Math.max(...data.map((x) => x.rejectTotal!))*0.85;
	  const bucketDiv = Math.ceil(high / ColorBuckets.length);
	  const newgm: Record<string, string> = {};
	  for (let i = 0; i < ColorBuckets.length; ++i) {
	    newgm[(bucketDiv * i).toString()] = ColorBuckets[i];
	  }
	  setGM(newgm);


	  barDataSet({
	    stateName: FIPS_TO_STATES_MAP[fipsCode!],
	    XTitle: "Rejection Reasons",
	    Title: "Mail Ballot Rejections",
	    data: [
	      { category: "Total", value: aggregateData[0].rejectTotal },
	      { category: "Late", value: aggregateData[0].rejectLate },
	      { category: "No Signature", value: aggregateData[0].rejectNoSignature },
	      { category: "No Witness Signature", value: aggregateData[0].rejectNoWitnessSignature },
	      { category: "Signature Mismatch", value: aggregateData[0].rejectSignatureMismatch },
	      { category: "Unofficial Envelope", value: aggregateData[0].rejectUnofficialEnv },
	      { category: "Ballot Missing", value: aggregateData[0].rejectBallotMissing },
	      { category: "No Secrecy Envelope", value: aggregateData[0].rejectNoSecrecyEnvironment },
	      { category: "Multiple in Envelope", value: aggregateData[0].rejectMultipleInEnvironment },
	      { category: "Unsealed Envelope", value: aggregateData[0].rejectUnsealedEnvironment },
	      { category: "No Postmark", value: aggregateData[0].rejectNoPostMark },
	      { category: "No Address", value: aggregateData[0].rejectNoAddress },
	      { category: "Voter Deceased", value: aggregateData[0].rejectVoterDeceased },
	      { category: "Duplicate Vote", value: aggregateData[0].rejectDuplicateVote },
	      { category: "Missing Documentation", value: aggregateData[0].rejectMissingDocumentation },
	      { category: "Not Eligible", value: aggregateData[0].rejectNotEligible },
	      { category: "No Application", value: aggregateData[0].rejectNoApplication },
	      { category: "Other", value: aggregateData[0].rejectOther },
	    ],
	  });

	  rowDataSet(
	    data.map((x) => {
	      return { id: x.fullRegionId, ...x };
	    })
	  );

	}
      })();
    },
    [activeDataStateHook]
  );
  
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
	color: "purple",
	weight: 1,
    };

    const t = feature.properties.STATEFP as string+feature.properties.COUNTYFP as string + "00000";
    if (stateType !== "DETAIL_STATE_TYPE_NONE") {
      let number = 0;
      const n = activeDataStateHook[0];
      if (n == 0) 
	number = rowData.find((x) => x.fullRegionId === t)?.totalBallotsCast;
      if (n == 1)
	number = rowData.find((x) => x.fullRegionId === t)?.total;
      if (n == 2)
	number = rowData.find((x) => x.fullRegionId === t)?.totalRemoved;
      if (n == 3)
	number = rowData.find((x) => x.fullRegionId === t)?.rejectTotal;
      const gradientMapNearestColor = gradientMapNearest(number || 0, GradientMap0);
      result.fillColor = gradientMapNearestColor;
      result.fillOpacity = 1.0;
      for (const tt of rowSelectionModel.ids) {
	if (t === tt) {
	  result.weight = 4;
	  break;
	}
      }
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
  {stateType !== "DETAIL_STATE_TYPE_NONE" && <MapLegend GradientMap0={GradientMap0}/>}
	</StateMap>
	</Paper>
      </Stack>
      <Stack spacing={3} sx={{ mt: 2, ml: 4, height: "50%", width: "50%" }}>
	<DataGrid
	  disableColumnMenu
	  disableColumnSelector
	  
	  rows={rowData}
	  onRowSelectionModelChange={
	    (x) => {
	      setRowSelectionModel(x);
	    }
	  }
	  columns={getColumnData(activeDataStateHook[0])}
	    initialState={{
	    pagination: {
		paginationModel: {
		pageSize: 5,
		},
	    },
	    }}
	    pageSizeOptions={[5]}
	    checkboxSelection
	    disableRowSelectionOnClick
	/>
      <Paper  elevation={5}>
        {/*

<BarChart stateInfo={getData(activeDataStateHook[0])[stateType]}/>*/}
        <BarChart stateInfo={barData}/>
      </Paper>
      </Stack>
    </div>
  );
}

export default StateInformationView;
