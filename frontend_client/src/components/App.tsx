import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Route, Routes, useLocation } from 'react-router';
import './App.css';

import NotFoundPage from "./NotFoundPage";
import BackgroundBlur from "./BackgroundBlur";

import StateInformationView from './StateInformationView';
import DisplayVotingMachineSummaryView from './DisplayVotingMachineSummaryView';
import VoterComparisonOptInOptOutTableView from './VoterComparisonOptInOutTableView';
import FrontPage from './FrontPage';
import PartyComparisonView from './PartyComparisonView';
import EarlyVotingComparisonView from './EarlyVotingComparisonView';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface DisplayPathOverlay {
  matchPortion: string,
  component: React.ReactNode;
};

const theme = createTheme({ 
  colorSchemes: {
  }
});

const darkTheme = createTheme({ 
  colorSchemes: {
    dark: true,
  }
});

function App() {
  const location = useLocation();
  const useDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const showBlocker = location.pathname !== "/";
  const overlayPaths: DisplayPathOverlay[] = [
    { matchPortion: "/display/voting-machine-summary", component: <DisplayVotingMachineSummaryView/> },
    { matchPortion: "/compare/optvote", component: <VoterComparisonOptInOptOutTableView/> },
    { matchPortion: "/compare/party-registration", component: <PartyComparisonView/> },
    { matchPortion: "/compare/early-voting", component: <EarlyVotingComparisonView/> },
    { matchPortion: "/state/:fipsCode/*", component: <StateInformationView/> },
  ];

  return (
    <React.Fragment>
      <ThemeProvider theme={(useDarkMode) ? darkTheme : theme}>
        <Routes>
          <Route path="/" element={<FrontPage/>}/>
          {overlayPaths.map((x) => <Route path={x.matchPortion} element={<FrontPage/>}/>)}
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
        <BackgroundBlur showBlocker={showBlocker}/>
        {/* NOTE(jerry): Needed in order to do the overlay effect that I think looks cool. */}
        <Routes>
          {overlayPaths.map((x) => <Route path={x.matchPortion} element={x.component}/>)}
          <Route path="*" element={<React.Fragment/>}/>
        </Routes> 
      </ThemeProvider>
   </React.Fragment>
  )
}

export default App
