import type { ReactNode } from 'react';
import type { GridColDef } from '@mui/x-data-grid';

import { useNavigate, useParams } from 'react-router';
import { DataGrid } from '@mui/x-data-grid';
import InboxIcon from '@mui/icons-material/Inbox';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import BallotIcon from '@mui/icons-material/Ballot';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ScannerIcon from '@mui/icons-material/Scanner';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';

import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';

import { useState } from 'react';

import styles from './StateInformationView.module.css';
import { FIPS_TO_STATES_MAP } from '../FullBoundedUSMap/boundaryData';
import StateMap from '../StateMap';

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

interface StateInformationViewDrawerItem {
  id: number;
  iconComponent?: ReactNode;
  textContent: string;
};
interface StateInformationViewDrawerSection {
  title: string;
  iconComponent?: ReactNode;
  items: StateInformationViewDrawerItem[];
};

interface StateInformationViewDrawerProperties {
  stateHook: [number, (arg0: number) => void];
  sections: StateInformationViewDrawerSection[];
};

interface StateInformationViewDrawerListItemProperties {
  stateHook: [number, (arg0: number) => void];
  item: StateInformationViewDrawerItem;
};

function StateInformationViewDrawerListItem(
  {
    item,
    stateHook,
  }: StateInformationViewDrawerListItemProperties) {
  const [stateValue, setStateValue] = stateHook;

  return (
    <ListItem>
	<ListItemButton
	  key={item.id}
	  onClick={() => setStateValue(item.id)}
	  selected={stateValue == item.id}>
	    {((item.iconComponent) && <ListItemIcon>{item.iconComponent}</ListItemIcon>)}
	    <ListItemText primary={item.textContent}/>
	</ListItemButton>
    </ListItem>
  );
}

function StateInformationViewDrawer(
  {
    sections,
    stateHook,
  }: StateInformationViewDrawerProperties) {
  const navigate = useNavigate();
  const sectionComponents = sections.map(
    (section) => (
      <>
	<ListItem>
	    {((section.iconComponent) && <ListItemIcon>{section.iconComponent}</ListItemIcon>)}
	    <ListItemText primary={section.title}/>
	</ListItem>
	{
	  section.items.map(item => <StateInformationViewDrawerListItem stateHook={stateHook} item={item}/>)
	}
      </>
    )
  );

  const finalComponentsWithDividers = [];
  for (let i = 0; i < sectionComponents.length; ++i) {
    finalComponentsWithDividers.push(sectionComponents[i]);
    if (i+1 >= sectionComponents.length) {
      continue;
    } else {
      finalComponentsWithDividers.push(<Divider/>);
    }
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
	'& .MuiDrawer-paper': {
	  width: '14em',
	  height: 'auto',
	  margin: 2,
	},
      }}
    >
    <EAVsStateCard/>
    <List dense>
      {finalComponentsWithDividers}
    </List>
    <Button onClick={() => navigate("/")} variant='contained' color='secondary'>
      <HighlightOffIcon/> Exit State Display
    </Button>
    </Drawer>
  );
}

function EAVsStateCard() {
  return (
    <Card sx={{m: 2}} variant="outlined">
      <CardContent>
	<Typography variant="h6" component="div">
	  EAVS-Only State
	</Typography>
	<Typography sx={{ color: 'text.secondary', m:0, fontSize: 12 }}>
	  This is not a detail state, so information will be limited compared to select states.
	</Typography>
      </CardContent>
    </Card>
  );
}

// TODO(jerry):
// Should accept a type parameter, but
// for now I guess that's fine to not have it.
function DetailStateCard() {
  return (
    <Card sx={{m: 2}} variant="outlined">
      <CardContent>
	<Typography variant="h6" component="div">
	  Voter Registation State
	</Typography>
	<Typography sx={{ color: 'text.secondary', m:0, fontSize: 12 }}>
	  This is a selected detail state for voter registration data, you can also view voter records for this state.
	</Typography>
      </CardContent>
    </Card>
  );
}

function StateInformationView() {
  const { fipsCode } = useParams();
  const activeDataStateHook = useState(0);
  const [activeDataSelection, setActiveDataSelection] = activeDataStateHook;

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

  return (
    <div className={styles.stateInformationPopup}>
      <Box>
	<StateInformationViewDrawer
	  stateHook={activeDataStateHook}
	  sections={dropDownSections}/>
      </Box>

      <Stack direction="column">
	<Paper
	  sx={{ mt: 2, ml: 'auto' }}
	  elevation={5}>
	  <Typography variant="h3" component="h2">
	    {FIPS_TO_STATES_MAP[fipsCode!]}
	  </Typography>
	    <StateMap fipsCode={fipsCode}/>
	</Paper>
	<Paper
	  sx={{ mt: 2, ml: 'auto' }}
	  elevation={5}>
	  <Typography variant="h3" component="h2">
  Let's pretend this is a chart!
	  </Typography>
	    <StateMap fipsCode={fipsCode}/>
	</Paper>
      </Stack>
      <Paper elevation={5} sx={{ mt: 2, ml: 8, height: "50%", width: "100%" }}>
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
