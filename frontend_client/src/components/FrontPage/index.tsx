import "leaflet/dist/leaflet.css";
import styles from "./FrontPage.module.css";

import type { MapRef } from "react-leaflet/MapContainer";
import type { FipsCode, FullBoundedUSMapStylingFn } from "../FullBoundedUSMap/";

import { FIPS_TO_STATES_MAP } from "../FullBoundedUSMap/boundaryData";

import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import FullBoundedUSMap from "../FullBoundedUSMap/";

import { Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, Box, AppBar, Toolbar, Typography, useTheme } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import WelcomeApplicationDialog from "../WelcomeApplicationDialog";
import NotImplementedYet from "../NotImplementedYetDialog";

import { isDetailState } from "../FullBoundedUSMap/detailedStatesInfo";

import useChoroplethStylingFunction from "../../hooks/useChoroplethStylingFunction";
import GradientMapLegend from "../GradientMapLegend";

import type { VotingEquipmentUsageStatisticsModel } from "../../api/client";
import { getVotingEquipmentUsage } from "../../api/client";

import { VOTING_EQUIPMENT_AGE_CHOROPLETH_BUCKETS } from "../../helpers/choroplethBuckets";

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
          <ListItemButton
            onClick={() => {
              showVotingEquipmentHook[1](!showVotingEquipmentHook[0]);
            }}
          >
            {" "}
            <ListItemText primary={showVotingEquipmentHook[0] ? "Show Default Map" : "Show Voting Equipment Age"} />{" "}
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
  const [showVotingEquipmentAge, _] = showVotingEquipmentHook;
  const [votingEquipmentUsageData, setVotingEquipmentUsageData] = useState<VotingEquipmentUsageStatisticsModel[]>([]);
  const theme = useTheme();

  const onStateClick = (fipsCode: FipsCode) => {
    navigate(`/state/${fipsCode}`);
  };

  useEffect(
    function () {
      (async function () {
        if (showVotingEquipmentAge) {
          const data = await getVotingEquipmentUsage();
          setVotingEquipmentUsageData(data);
        }
      })();
    },
    [showVotingEquipmentAge]
  );

  const choroplethStylingFunction = useChoroplethStylingFunction(function (feature: GeoJSON.Feature) {
    if (!votingEquipmentUsageData) {
      return null;
    }
    const { id } = feature;

    const matchingRow = votingEquipmentUsageData.find((x) => x.stateId === parseInt(id as string, 10));
    const stateName = FIPS_TO_STATES_MAP[id!];
    console.log(id, stateName, matchingRow, matchingRow?.averageAge);
    return matchingRow?.averageAge || null;
  }, VOTING_EQUIPMENT_AGE_CHOROPLETH_BUCKETS);

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

    if (showVotingEquipmentAge) {
      if (highlightedStateFipsId === fipsCode) {
        result.fillOpacity = 1.0;
        // NOTE(jerry):
        // this is blue with the default MUI theme, and we're intentionally
        // not picking another shade of purple, because otherwise it might be misleading with
        // the choropleth.
        result.fillColor = theme.palette.primary.light;
        return result;
      }

      return choroplethStylingFunction(feature);
    } else {
      if (highlightedStateFipsId === fipsCode) {
        result.fillOpacity = 0.88;
        result.fillColor = theme.palette.secondary.light;
      }
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
        <FrontPageDrawer showVotingEquipmentHook={showVotingEquipmentHook} />
        <FullBoundedUSMap mapRef={mapState} id={styles.mainMap} onStateClick={onStateClick} styleFunction={styleFunction}>
          {showVotingEquipmentAge && <GradientMapLegend positionPreference={"topright"} gradientMap={VOTING_EQUIPMENT_AGE_CHOROPLETH_BUCKETS} />}
        </FullBoundedUSMap>
      </Box>
    </React.Fragment>
  );
}

export default FrontPage;
