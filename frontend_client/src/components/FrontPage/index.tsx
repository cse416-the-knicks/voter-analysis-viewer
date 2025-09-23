import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import type { MapRef } from 'react-leaflet/MapContainer';
import { useNavigate } from 'react-router';
import FullBoundedUSMap from '../FullBoundedUSMap/';
import type { FipsCode } from '../FullBoundedUSMap/';

import styles from './FrontPage.module.css';

import {
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function WelcomeApplicationDialog() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {setOpen(false);};
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Welcome!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
	    Welcome to the Knicks Teams CSE416.01 Voter-Analysis Project
	    <br/>
	    <br/>
	    Backend: Java with SpringBoot, GSON
	    <br/>
	    Frontend: Typescript with React, and MaterialUI
	    <br/>
	    Database: Postgres SQL Database instance.
	    <br/>
	  </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function FrontPageDrawer() {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
	'& .MuiDrawer-paper': {
	  width: '14em',
	  margin: 0,
	},
      }}
    >
      <List dense>
	<ListItem> <ListItemText primary={"COMPARE VOTING"}/> </ListItem>
	<ListItem> <ListItemButton onClick={() => navigate("/compare/parties")}> <ListItemText primary={"BIPARTISAN EARLY VOTING"}/> </ListItemButton> </ListItem>
	<ListItem> <ListItemButton onClick={() => navigate("/compare/optvote")}> <ListItemText primary={"OPT-IN, OPT-OUT VOTING"}/> </ListItemButton> </ListItem>
	<Divider/>
	<ListItem> <ListItemText primary={"DISPLAY"}/> </ListItem>
	<ListItem> <ListItemButton onClick={() => navigate("/display/voting-machine-age")}> <ListItemText primary={"VOTING EQUIPMENT AGE"}/> </ListItemButton> </ListItem>
	<ListItem> <ListItemButton onClick={() => navigate("/display/voting-machine-summary")}> <ListItemText primary={"VOTING EQUIPMENT 2024 SUMMARY"}/> </ListItemButton> </ListItem>
      </List>
      <Button variant='contained' color='secondary'>
	<HighlightOffIcon/> Reset to Default
      </Button>
    </Drawer>
  );
}

/**
 * This is the map used for the landing / splash page of the viewer.
 * 
 * Submaps will be defined as separate components.
 */
function FrontPage() {
  const mapState = useRef<MapRef>(null);
  const navigate = useNavigate();

  const onStateClick = (fipsCode: FipsCode) => {
    navigate(`/state/${fipsCode}`);
  }

  return (
    <React.Fragment>
      <WelcomeApplicationDialog/>
      <Box>
	<FrontPageDrawer/>
      <FullBoundedUSMap
	mapRef={mapState}
	id={styles.mainMap}
	onStateClick={onStateClick}>
      </FullBoundedUSMap>
      </Box>
    </React.Fragment>
  );
}

export default FrontPage;
