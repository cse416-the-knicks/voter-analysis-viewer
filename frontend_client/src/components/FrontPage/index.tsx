import "leaflet/dist/leaflet.css";
import styles from "./FrontPage.module.css";

import type { MapRef } from "react-leaflet/MapContainer";
import type { FipsCode } from "../FullBoundedUSMap/";

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import FullBoundedUSMap from "../FullBoundedUSMap/";

import { Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Box, AppBar, Toolbar, Typography, useTheme } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import WelcomeApplicationDialog from "../WelcomeApplicationDialog";
import NotImplementedYet from "../NotImplementedYetDialog";

interface FrontPageDrawerProperties {
  showVotingEquipmentHook: [boolean, (arg0: boolean) => void];
}

function FrontPageDrawer({ showVotingEquipmentHook }: FrontPageDrawerProperties) {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        "& .MuiDrawer-paper": {
          width: "14em",
          top: "4em",
          margin: 0,
        },
      }}
    >
      <List dense>
        <ListItem>
          {" "}
          <ListItemText primary={"State Comparisons"} />{" "}
        </ListItem>
        <ListItem>
          {" "}
          <ListItemButton onClick={() => navigate("/compare/party-states")}>
            {" "}
            <ListItemText primary={"Party States"} />{" "}
          </ListItemButton>{" "}
        </ListItem>
        <ListItem>
          {" "}
          <ListItemButton onClick={() => navigate("/compare/optvote")}>
            {" "}
            <ListItemText primary={"Opt-In, Opt-Out Voting"} />{" "}
          </ListItemButton>{" "}
        </ListItem>
        <Divider />
        <ListItem>
          {" "}
          <ListItemText primary={"Display"} />{" "}
        </ListItem>
        <ListItem>
          {" "}
          <ListItemButton onClick={() => navigate("/display/state-voting-equipment-usage")}>
            {" "}
            <ListItemText primary={"State Voting Equipment"} />{" "}
          </ListItemButton>{" "}
        </ListItem>
        <ListItem>
          {" "}
          <ListItemButton onClick={() => navigate("/display/voting-machine-summary")}>
            {" "}
            <ListItemText primary={"Voting Equipment 2024 Summary"} />{" "}
          </ListItemButton>{" "}
        </ListItem>
        <ListItem>
          {" "}
          <ListItemButton onClick={() => {showVotingEquipmentHook[1](!showVotingEquipmentHook[0]);}}>
            {" "}
            <ListItemText primary={(showVotingEquipmentHook[0]) ? "Show Default Map" : "Show Voting Equipment Age"} />{" "}
          </ListItemButton>{" "}
        </ListItem>
      </List>
      <Button variant="contained" color="secondary">
        <HighlightOffIcon /> Reset to Default
      </Button>
    </Drawer>
  );
}

function FrontPageTopBanner() {
  const theme = useTheme();

  return (
    <AppBar
      sx={{
        backgroundColor: theme.palette.secondary.main,
      }}
    >
      <Toolbar>
        <Typography fontFamily="inherit" variant="h4" align="center">
          Voter Analysis - Team Knicks
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

/**
 * This is the map used for the landing / splash page of the viewer.
 *
 * Submaps will be defined as separate components.
 */
function FrontPage() {
  const showNotImplementedYetHook = useState<boolean>(false);
  const mapState = useRef<MapRef>(null);
  const navigate = useNavigate();
  const showVotingEquipmentHook = useState(false);

  const onStateClick = (fipsCode: FipsCode) => {
    navigate(`/state/${fipsCode}`);
  };

  return (
    <React.Fragment>
      <FrontPageTopBanner />
      <WelcomeApplicationDialog />
      <NotImplementedYet hook={showNotImplementedYetHook} />
      <Box
        sx={{
          ml: "225px",
          mt: "48px",
        }}
      >
        <FrontPageDrawer
	  showVotingEquipmentHook={showVotingEquipmentHook}/>
	<FullBoundedUSMap mapRef={mapState} id={styles.mainMap} onStateClick={onStateClick}>
	</FullBoundedUSMap>
      </Box>
    </React.Fragment>
  );
}

export default FrontPage;
