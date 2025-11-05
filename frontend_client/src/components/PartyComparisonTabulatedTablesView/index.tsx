import { useEffect, useState } from "react";
import { Box, Paper, Typography, useTheme, Backdrop, Grow, Tabs, Tab } from "@mui/material";

import PartyComparisonView from "../PartyComparisonView";
import PartyEarlyVotingComparisonView from "../PartyEarlyVotingComparisonView";

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
    <Tabs
      value={activeWidget}
      onChange={function (_, x) {
        setActiveWidget(x);
      }}
      textColor="secondary"
      indicatorColor="secondary"
      variant="fullWidth"
    >
      <Tab label={"General Comparison"} {...a11yProps(0)} />
      <Tab label={"Early Voting Comparison"} {...a11yProps(1)} />
      <Tab label={"Registration / Turnout Comparison"} {...a11yProps(2)} />
    </Tabs>
  );
}

export default PartyComparisonTabulatedTablesView;
