import "leaflet/dist/leaflet.css";
import styles from "./FrontPage.module.css";

import type { MapRef } from "react-leaflet/MapContainer";
import type { FipsCode, FullBoundedUSMapStylingFn } from "../FullBoundedUSMap/";

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import FullBoundedUSMap from "../FullBoundedUSMap/";

import { Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Box, AppBar, Toolbar, Typography, useTheme } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import WelcomeApplicationDialog from "../WelcomeApplicationDialog";
import NotImplementedYet from "../NotImplementedYetDialog";

import { isDetailState } from "../FullBoundedUSMap/detailedStatesInfo";

import choroplethColorBuckets from "../../helpers/choroplethColorBuckets";
import useChoroplethStylingFunction from "../../hooks/useChoroplethStylingFunction";
import { type GradientMap } from "../../helpers/GradientMap";
import GradientMapLegend from "../GradientMapLegend";

import { Grow } from "@mui/material";

interface FrontPageDrawerProperties {
  showVotingEquipmentHook: [boolean, (arg0: boolean) => void];
}

const VOTING_EQUIPMENT_AGE_CHOROPLETH_BUCKETS: GradientMap = {
  0: choroplethColorBuckets[0],
  1: choroplethColorBuckets[1],
  2: choroplethColorBuckets[2],
  3: choroplethColorBuckets[3],
  4: choroplethColorBuckets[4],
  5: choroplethColorBuckets[5],
  6: choroplethColorBuckets[6],
  7: choroplethColorBuckets[7],
  8: choroplethColorBuckets[8],
  9: choroplethColorBuckets[9],
  10: choroplethColorBuckets[10],
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
  const theme = useTheme();

  const onStateClick = (fipsCode: FipsCode) => {
    navigate(`/state/${fipsCode}`);
  };

  const styleFunction: FullBoundedUSMapStylingFn = (highlightedStateFipsId: string, feature: GeoJSON.Feature) => {
    const fipsCode = feature.id as string;
    const result = {
      fillColor: "#00000000",
      fillOpacity: 0,
      color: theme.palette.secondary.main,
      weight: 1,
      zIndex: 10,
    };

    if (fipsCode && isDetailState(fipsCode)) {
      result.weight = 4;
      result.fillOpacity = 0.4;
      result.fillColor = theme.palette.secondary.light;
    }

    if (highlightedStateFipsId === fipsCode) {
      result.fillOpacity = 0.88;
      result.fillColor = theme.palette.secondary.light;
    }

    return result;
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
	<FullBoundedUSMap
	  mapRef={mapState}
	  id={styles.mainMap}
	  onStateClick={onStateClick}
	  styleFunction={styleFunction}
	  >
	  {
	    (showVotingEquipmentHook[0]) &&
	      <GradientMapLegend
		positionPreference={"topright"}
		gradientMap={VOTING_EQUIPMENT_AGE_CHOROPLETH_BUCKETS} />
}
	</FullBoundedUSMap>
      </Box>
    </React.Fragment>
  );
}

export default FrontPage;
