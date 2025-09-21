import { useNavigate, useParams } from 'react-router';
import styles from './StateInformationView.module.css';
import StateMap from '../StateMap';
import { FIPS_TO_STATES_MAP } from '../FullBoundedUSMap/boundaryData';
import InboxIcon from '@mui/icons-material/Inbox';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import BallotIcon from '@mui/icons-material/Ballot';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ScannerIcon from '@mui/icons-material/Scanner';
import Stack from '@mui/material/Stack';
import type { GridColDef } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';

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

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

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

function StateInformationView() {
  const { fipsCode } = useParams();
  console.log(fipsCode);
  const navigate = useNavigate();
  const card = (
    <>
      <CardContent>
	<Typography variant="h6" component="div">
  EAVS-Only State
	</Typography>
	<Typography sx={{ color: 'text.secondary', m:0, fontSize: 12 }}>
	  This is not a detail state, so information will be limited compared to select states.
	</Typography>
      </CardContent>
    </>
  );


  return (
    <div className={styles.stateInformationPopup}>
      <Box>
	<Drawer
	  variant="permanent"
	  sx={{
	    '& .MuiDrawer-paper': { width: '14em', height: 'auto', margin: 2 },
	  }}>
	  <Card sx={{m: 2}} variant="outlined">{card}</Card>
	  <List dense>
	  <ListItem>
  <ListItemIcon><BallotIcon/></ListItemIcon>
  <ListItemText primary={"Ballot Data"}/> </ListItem>
	  <ListItem>
	    <ListItemButton>
  <ListItemIcon><InboxIcon/></ListItemIcon>
  <ListItemText primary={"Provisional Ballots"}/>
	    </ListItemButton>
	  </ListItem>
	  <ListItem>
	    <ListItemButton>
  <ListItemIcon><PersonIcon/></ListItemIcon>
  <ListItemText primary={"Active Voters"}/>
	    </ListItemButton>
	  </ListItem>
	  <ListItem>
	    <ListItemButton>
  <ListItemIcon><DeleteForeverIcon/></ListItemIcon>
  <ListItemText primary={"Pollbook Deletions"}/>
	    </ListItemButton>
	  </ListItem>
	  <ListItem>
	    <ListItemButton>
  <ListItemIcon><PersonOffIcon/></ListItemIcon>
  <ListItemText primary={"Mail Ballot Rejections"}/>
	    </ListItemButton>
	  </ListItem>
	  <Divider/>
	  <ListItem> <ListItemText primary={"Voting Equipment"}/> </ListItem>
	  <ListItem>
	    <ListItemButton>
  <ListItemIcon><ScannerIcon/></ListItemIcon>
  <ListItemText primary={"By Type"}/> </ListItemButton>
	  </ListItem>
	  <ListItem>
	    <ListItemButton>
  <ListItemIcon><AccessTimeIcon/></ListItemIcon>
  <ListItemText primary={"By Age"}/> </ListItemButton>
	  </ListItem>
	  </List>
	  <Button onClick={() => navigate("/")} variant='contained' color='secondary'>
  <HighlightOffIcon/> Exit State Display</Button>
	</Drawer>
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
