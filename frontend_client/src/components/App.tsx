import "leaflet/dist/leaflet.css";
import React from "react";
import { Route, Routes, useLocation } from "react-router";
import "./App.css";

import NotFoundPage from "./NotFoundPage";

import StateInformationView from "./StateInformationView";
import DisplayVotingMachineSummaryView from "./DisplayVotingMachineSummaryView";
import VoterComparisonOptInOptOutTableView from "./VoterComparisonOptInOutTableView";
import FrontPage from "./FrontPage";
import PartyComparisonTabulatedTablesView from "./PartyComparisonTabulatedTablesView";

import { CssBaseline, useMediaQuery, Backdrop } from "@mui/material";

import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";

interface DisplayPathOverlay {
  matchPortion: string;
  component: React.ReactNode;
}

const theme = responsiveFontSizes(
  createTheme({
    colorSchemes: {},
  })
);

const darkTheme = responsiveFontSizes(
  createTheme({
    colorSchemes: {
      dark: true,
    },
  })
);

function App() {
  const location = useLocation();
  const useDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const showBlocker = location.pathname !== "/";
  const overlayPaths: DisplayPathOverlay[] = [
    { matchPortion: "/display/voting-machine-summary", component: <DisplayVotingMachineSummaryView /> },
    { matchPortion: "/compare/optvote", component: <VoterComparisonOptInOptOutTableView /> },
    { matchPortion: "/compare/party-states", component: <PartyComparisonTabulatedTablesView /> },
    { matchPortion: "/state/:fipsCode/*", component: <StateInformationView /> },
  ];

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={useDarkMode ? darkTheme : theme}>
        <Routes>
          <Route path="/" element={<FrontPage />} />
          {overlayPaths.map((x) => (
            <Route path={x.matchPortion} element={<FrontPage />} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {/* NOTE(jerry): Needed in order to do the overlay effect that I think looks cool. */}
        <Backdrop open={showBlocker} sx={{ zIndex: 1200 }}>
          <Routes>
            {overlayPaths.map((x) => (
              <Route path={x.matchPortion} element={x.component} />
            ))}
            <Route path="*" element={<React.Fragment />} />
          </Routes>
        </Backdrop>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
