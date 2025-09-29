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
import { mockData } from '../DataDisplays/DisplayData';
import BubbleChart from '../DataDisplays/BubbleChart';
import { StateInformationViewDrawer } from './StateInformationViewDrawer';

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

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

  // TODO: dynamically calculate height.
  return (
    <div className={styles.stateInformationPopup}>
      <Box>
	<StateInformationViewDrawer
	  stateHook={activeDataStateHook}
	  sections={dropDownSections}
	  stateType={getDetailStateType(fipsCode!)}/>
      </Box>

      <Stack direction="column">
	<Paper
	  sx={{ mt: 2, ml: 'auto' }}
	  elevation={5}>
	  <Typography variant="h3" component="h2">
	    {FIPS_TO_STATES_MAP[fipsCode!]}
	  </Typography>
	  <StateMap width={"600px"} height={"350px"} fipsCode={fipsCode}/>
	</Paper>
	<BubbleChart data={mockData} width={600} height={350}/>
      </Stack>
      <Paper elevation={5} sx={{ mt: 2, ml: 8, height: "50%", width: "50%" }}>
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
      </Paper>
    </div>
  );
}

export default StateInformationView;
