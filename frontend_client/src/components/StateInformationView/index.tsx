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

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);


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
      <Paper
	sx={{ mt: 2, ml: 'auto' }}
	elevation={5}>
	  <Typography variant="h3" component="h2">
	    {FIPS_TO_STATES_MAP[fipsCode!]}
	  </Typography>
	    <StateMap fipsCode={fipsCode}/>
	  <Typography>
	  </Typography>
      </Paper>
    </div>
  );
}

export default StateInformationView;
