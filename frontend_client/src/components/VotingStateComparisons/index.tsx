/*
import type { GridColDef } from '@mui/x-data-grid';
import type { ViewStateYearSummaryModel, VotingEquipmentModel } from '../../api/client';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useNavigate } from 'react-router';
import useKeyDown from '../../hooks/useKeyDown';

import {
  Box,
  Paper,
  AppBar,
  Typography,
  Button,
  Grid
} from '@mui/material';

import styles from './DisplayVotingMachineSummaryView.module.css';
import { getViewStateYearSummaryByStateForYear } from '../../api/client';

const columns: GridColDef<(ViewStateYearSummaryModel)[number]>[] = [
  {
    field: 'stateName',
    headerName: 'State Name',
    width: 160,
  },
  {
    field: 'activeRegistered',
    headerName: 'Active Registered',
    type: 'number',
    width: 160,
  },
  {
    field: 'inactiveRegistered',
    headerName: 'Inactive Registered',
    type: 'number',
    width: 170,
  },
  {
    field: 'totalRegistered',
    headerName: 'Total Registered',
    type: 'number',
    width: 160,
  },
  {
    field: 'totalBallotsCast',
    headerName: 'Total Ballots Cast',
    type: 'number',
    width: 170,
  },
  {
    field: 'earlyVotingTotal',
    headerName: 'Early Voting Total',
    type: 'number',
    width: 170,
  },
  {
    field: 'ballotsByMail',
    headerName: 'Ballots By Mail',
    type: 'number',
    width: 160,
  },
  {
    field: 'totalProvisionalBallotsCast',
    headerName: 'Provisional Ballots',
    type: 'number',
    width: 180,
  },
  {
    field: 'activeVoterRate',
    headerName: 'Active Voter Rate %',
    type: 'number',
    width: 170,
      valueFormatter: (value) => {
    if (value === null || value === undefined) {
      return ''; // Handle null or undefined values
    }
    // Assuming the value is a decimal (e.g., 0.75) and you want to display it as 75%
    return `${(value * 100).toFixed(2)}%`; // Format to 2 decimal places and add '%'
  },
  },
  {
    field: 'inactiveVoterRate',
    headerName: 'Inactive Voter Rate %',
    type: 'number',
    width: 180,
      valueFormatter: (value) => {
    if (value === null || value === undefined) {
      return ''; // Handle null or undefined values
    }
    // Assuming the value is a decimal (e.g., 0.75) and you want to display it as 75%
    return `${(value * 100).toFixed(2)}%`; // Format to 2 decimal places and add '%'
  },
  },
  {
    field: 'turnOutRate',
    headerName: 'Turnout Rate %',
    type: 'number',
    width: 150,
      valueFormatter: (value) => {
    if (value === null || value === undefined) {
      return ''; // Handle null or undefined values
    }
    // Assuming the value is a decimal (e.g., 0.75) and you want to display it as 75%
    return `${(value * 100).toFixed(2)}%`; // Format to 2 decimal places and add '%'
  },
  },
  {
    field: 'earlyVotingShareRate',
    headerName: 'Early Voting Share %',
    type: 'number',
    width: 190,
    valueFormatter: (value) => {
      if (value === null || value === undefined) {
        return ''; // Handle null or undefined values
      }
      // Assuming the value is a decimal (e.g., 0.75) and you want to display it as 75%
      return `${(value * 100).toFixed(2)}%`; // Format to 2 decimal places and add '%'
    },
  },
  {
    field: 'mailinBallotVotingShareRate',
    headerName: 'Mail-in Ballot Share %',
    type: 'number',
    width: 200,
    valueFormatter: (value) => {
    if (value === null || value === undefined) {
      return ''; // Handle null or undefined values
    }
    // Assuming the value is a decimal (e.g., 0.75) and you want to display it as 75%
    return `${(value * 100).toFixed(2)}%`; // Format to 2 decimal places and add '%'
  },
  },
];

function VotingStateSummaryOptInOptOut() {
  const navigate = useNavigate();
  const [rows, setDataRows] = useState<ViewStateYearSummaryModel[]>([]);

  useKeyDown('Escape', () => navigate('/'));

  useEffect(
    function () {
      (async function () {
        const promises = [
          getViewStateYearSummaryByStateForYear("48", 2024),
          getViewStateYearSummaryByStateForYear("26", 2024),
          getViewStateYearSummaryByStateForYear("13", 2024),
        ]

    	  setDataRows(await Promise.all(promises));
      })();
    },
    []);

  return (
    <Box className={styles.displayInformationPopup} maxWidth="1000px">
      <Paper
	sx={{ mt: 2, ml: 'auto' }}
	elevation={9}>
	<AppBar sx={{position: "static"}} color="secondary">
	    <Grid container justifyContent="space-between">
		<Grid size={3.25}>
		    <Typography variant="h6">Opt-in / Opt-out State Voting Comparison</Typography>
		</Grid>
		<Grid>
		    <Button onClick={() => navigate("/")} variant='text' sx={{color: "white"}}>
			<HighlightOffIcon/>
		    </Button>
		</Grid>
	    </Grid>
	</AppBar>
  <Box maxWidth="1500px">
<DataGrid
	    rows={rows}
	    columns={columns}
	    getRowId={(x) => x.stateFipsCode}
      disableColumnMenu
      disableColumnSelector
      getRowClassName={(r) => r.indexRelativeToCurrentPage % 2 == 0 ? styles.oddRow : ""}
      
      sx={{
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: "bolder",
          },
          "& .MuiDataGrid-cell--textLeft": {
            fontWeight: "bolder",
          }
      }}
	    initialState={{
	    pagination: {
		paginationModel: {
		pageSize: 12,
		},
	    },
	    }}
	    pageSizeOptions={[10]}
	    disableRowSelectionOnClick
	/>
  </Box>
	
      </Paper>
    </Box>
  );
}

export default VotingStateSummaryOptInOptOut;
*/

import type { GridColDef } from '@mui/x-data-grid';
import type { ViewStateYearSummaryModel, VotingEquipmentModel } from '../../api/client';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useNavigate } from 'react-router';
import useKeyDown from '../../hooks/useKeyDown';

import {
  Box,
  Paper,
  AppBar,
  Typography,
  Button,
  Grid
} from '@mui/material';

import styles from './DisplayVotingMachineSummaryView.module.css';
import { getViewStateYearSummaryByStateForYear } from '../../api/client';

function VotingStateSummaryOptInOptOut() {
  const navigate = useNavigate();
  const [rows, setDataRows] = useState<ViewStateYearSummaryModel[]>([]);
  const [cols, setColumnRows] = useState<any>([]);

  useKeyDown('Escape', () => navigate('/'));

  useEffect(
    function () {
      (async function () {
        const promises = [
          getViewStateYearSummaryByStateForYear("48", 2024),
          getViewStateYearSummaryByStateForYear("26", 2024),
          getViewStateYearSummaryByStateForYear("13", 2024),
        ]
        const awaited = await Promise.all(promises);

        console.log(awaited);
        setColumnRows(
          [
            {
              field: 'name',
              headerName: "Metric",
              type: "string",
              width: 200,
            },
                    {
          field: 'x',
          headerName: awaited[0].stateName,
          type: 'number',
          width: 160,
        },
          {
          field: 'y',
          headerName: awaited[1].stateName,
          type: 'number',
          width: 160,
        },          {
          field: 'z',
          headerName: awaited[2].stateName,
          type: 'number',
          width: 160,
        },
          ]);
          let rowsD = [];
          {
            rowsD.push(
              {
    name: "Type",
    x: "Opt-In",
    y: "Opt-Out (SDR)",
    z: "Opt-Out",
  },
  {
    name: "Active Registered",
    x: awaited[0].activeRegistered,
    y: awaited[1].activeRegistered,
    z: awaited[2].activeRegistered,
  },
  {
    name: "Inactive Registered",
    x: awaited[0].inactiveRegistered,
    y: awaited[1].inactiveRegistered,
    z: awaited[2].inactiveRegistered,
  },
  {
    name: "Total Registered",
    x: awaited[0].totalRegistered,
    y: awaited[1].totalRegistered,
    z: awaited[2].totalRegistered,
  },
  {
    name: "Total Ballots Cast",
    x: awaited[0].totalBallotsCast,
    y: awaited[1].totalBallotsCast,
    z: awaited[2].totalBallotsCast,
  },
  {
    name: "Early Voting Total",
    x: awaited[0].earlyVotingTotal,
    y: awaited[1].earlyVotingTotal,
    z: awaited[2].earlyVotingTotal,
  },
  {
    name: "Ballots By Mail",
    x: awaited[0].ballotsByMail,
    y: awaited[1].ballotsByMail,
    z: awaited[2].ballotsByMail,
  },
  {
    name: "Provisional Ballots",
    x: awaited[0].totalProvisionalBallotsCast,
    y: awaited[1].totalProvisionalBallotsCast,
    z: awaited[2].totalProvisionalBallotsCast,
  },
  {
  name: "Active Voter Rate %",
  x: (awaited[0].activeVoterRate * 100).toFixed(1) + "%",
  y: (awaited[1].activeVoterRate * 100).toFixed(1) + "%",
  z: (awaited[2].activeVoterRate * 100).toFixed(1) + "%",
},
{
  name: "Inactive Voter Rate %",
  x: (awaited[0].inactiveVoterRate * 100).toFixed(1) + "%",
  y: (awaited[1].inactiveVoterRate * 100).toFixed(1) + "%",
  z: (awaited[2].inactiveVoterRate * 100).toFixed(1) + "%",
},
{
  name: "Turnout Rate %",
  x: (awaited[0].turnOutRate * 100).toFixed(1) + "%",
  y: (awaited[1].turnOutRate * 100).toFixed(1) + "%",
  z: (awaited[2].turnOutRate * 100).toFixed(1) + "%",
},
{
  name: "Early Voting Share %",
  x: (awaited[0].earlyVotingShareRate * 100).toFixed(1) + "%",
  y: (awaited[1].earlyVotingShareRate * 100).toFixed(1) + "%",
  z: (awaited[2].earlyVotingShareRate * 100).toFixed(1) + "%",
},
{
  name: "Mail-in Ballot Share %",
  x: (awaited[0].mailinBallotVotingShareRate * 100).toFixed(1) + "%",
  y: (awaited[1].mailinBallotVotingShareRate * 100).toFixed(1) + "%",
  z: (awaited[2].mailinBallotVotingShareRate * 100).toFixed(1) + "%",
},

);

          }
    	  setDataRows(rowsD);
      })();
    },
    []);

  return (
    <Box className={styles.displayInformationPopup} width="1000px">
      <Paper
	sx={{ mt: 2, ml: 'auto' }}
	elevation={9}>
	<AppBar sx={{position: "static"}} color="secondary">
	    <Grid container justifyContent="space-between">
		<Grid size={10.25}>
		    <Typography variant="h6">Opt-in / Opt-out State Voting Comparison</Typography>
		</Grid>
		<Grid>
		    <Button onClick={() => navigate("/")} variant='text' sx={{color: "white"}}>
			<HighlightOffIcon/>
		    </Button>
		</Grid>
	    </Grid>
	</AppBar>
  <Box width="700px">
<DataGrid
	    rows={rows}
	    columns={cols}
	    getRowId={(x) => x.name}
      disableColumnMenu
      disableColumnSelector
      getRowClassName={(r) => r.indexRelativeToCurrentPage % 2 == 0 ? styles.oddRow : ""}
      
      sx={{
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: "bolder",
          },
          "& .MuiDataGrid-cell--textLeft": {
            fontWeight: "bolder",
          }
      }}
	    initialState={{
	    pagination: {
		paginationModel: {
		pageSize: 12,
		},
	    },
	    }}
	    pageSizeOptions={[10]}
	    disableRowSelectionOnClick
	/>
  </Box>
	
      </Paper>
    </Box>
  );
}

export default VotingStateSummaryOptInOptOut;
