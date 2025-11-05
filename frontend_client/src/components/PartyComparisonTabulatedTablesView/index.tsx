import { useState } from "react";
import { Box, useTheme, Tabs, Tab } from "@mui/material";

import PartyComparisonView from "../PartyComparisonView";
import PartyEarlyVotingComparisonView from "../PartyEarlyVotingComparisonView";
import PartyGeneralComparisonView from "../PartyGeneralComparisonView";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function PartyComparisonTabulatedTablesView() {
  const theme = useTheme();
  const [activeWidget, setActiveWidget] = useState(0);
  return (
    <Box
      sx={
	{
	  position:"fixed",
	  top:"0"
	}
      }
    >
	<Tabs
	    value={activeWidget}
	    onChange={function (_, x) {
		setActiveWidget(x);
	    }}
	    textColor="secondary"
	    indicatorColor="secondary"
	    variant="fullWidth"
	    sx={{background: theme.palette.background.paper}}
	    >
	    <Tab label={"General Comparison"} {...a11yProps(0)} />
	    <Tab label={"Early Voting Comparison"} {...a11yProps(1)} />
	    <Tab label={"Registration / Turnout Comparison"} {...a11yProps(2)} />
	</Tabs>
      {
	(activeWidget === 2) ? <PartyComparisonView/> :
	  (activeWidget === 1) ? <PartyEarlyVotingComparisonView/> :
	    (activeWidget === 0) ? <PartyGeneralComparisonView/> : <></>
      }
    </Box>
  );
}

export default PartyComparisonTabulatedTablesView;
