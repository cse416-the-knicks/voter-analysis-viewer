import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import type { MapRef } from 'react-leaflet/MapContainer';
import { useNavigate } from 'react-router';
import FullBoundedUSMap from '../FullBoundedUSMap/';
import type { FipsCode } from '../FullBoundedUSMap/';
import { useLocation } from 'react-router';

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
  Typography,
  Stack,
  AppBar
} from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function WelcomeApplicationDialog() {
  const location = useLocation();
  const [open, setOpen] = React.useState(location.pathname === '/');
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
	    Welcome to <b>the Knicks</b> Teams CSE416.01 Voter-Analysis Project
	    <br/>
	    <br/>
	    Backend: Java with SpringBoot, Jackson
	    <br/>
	    Frontend: Typescript with React, Leaflet, D3, and MaterialUI
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

function NotImplementedYet({hook}) {
  const handleClose = () => {hook[1](false);};
  return (
    <React.Fragment>
      <Dialog
        open={hook[0]}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Your UI is in another castle!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
	    <img width={128} height={128} src="https://cdn-icons-png.flaticon.com/512/71/71872.png"></img>
	    <br/>
	    <br/>
  We are not ready to show this yet! It is either not designed yet or
	    we haven't though of it yet!
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

function FrontPageDrawer({hook}) {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
	'& .MuiDrawer-paper': {
	  width: '14em',
	  top: "3.20em",
	  margin: 0,
	  borderRightColor: "purple",
	},
      }}
    >
      <List dense>
	<ListItem> <ListItemText primary={"Compare Voting"}/> </ListItem>
	<ListItem> <ListItemButton onClick={() => hook[1](true)}> <ListItemText primary={"Bipartisan Early Voting"}/> </ListItemButton> </ListItem>
	<ListItem> <ListItemButton onClick={() => navigate("/display/opt-in-opt-out-state-comparison")}> <ListItemText primary={"Opt-In, Opt-Out Voting"}/> </ListItemButton> </ListItem>
	<Divider/>
	<ListItem> <ListItemText primary={"Display"}/> </ListItem>
	<ListItem> <ListItemButton onClick={() => hook[1](true)}> <ListItemText primary={"Voting Equipment Age"}/> </ListItemButton> </ListItem>
	<ListItem> <ListItemButton onClick={() => navigate("/display/voting-machine-summary")}> <ListItemText primary={"Voting Equipment 2024 Summary"}/> </ListItemButton> </ListItem>
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
  const unimplementedHook = React.useState(false);
  const navigate = useNavigate();

  const onStateClick = (fipsCode: FipsCode) => {
    navigate(`/state/${fipsCode}`);
  }

  return (
    <React.Fragment>
      <WelcomeApplicationDialog/>
      <NotImplementedYet hook={unimplementedHook}/>
      <Stack>
      <AppBar sx={{ backgroundColor: "purple"}}>
        <Typography fontFamily="inherit" variant="h4" align="center">
            Voter Analysis - Team Knicks
          </Typography>
      </AppBar>

      <Box>
	<FrontPageDrawer hook={unimplementedHook}/>
      <FullBoundedUSMap
	mapRef={mapState}
	id={styles.mainMap}
	onStateClick={onStateClick}>
      </FullBoundedUSMap>
	<br/>
	<br/>
	  <Typography variant="p" component="p">
  This Voter-Analysis Application was developed by 'The Knicks' with love ♡
	  </Typography>
      </Box>
      </Stack>
    </React.Fragment>
  );
}

export default FrontPage;
