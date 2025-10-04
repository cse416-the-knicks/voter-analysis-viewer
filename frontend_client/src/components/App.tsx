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

interface DisplayPathOverlay {
  matchPortion: string,
  component: React.ReactNode;
};

function App() {
  const location = useLocation();
  const showBlocker = location.pathname !== "/";
  const overlayPaths: DisplayPathOverlay[] = [
    { matchPortion: "/display/voting-machine-summary", component: <DisplayVotingMachineSummaryView/> },
    { matchPortion: "/compare/optvote", component: <VoterComparisonOptInOptOutTableView/> },
    { matchPortion: "/state/:fipsCode/*", component: <StateInformationView/> },
  ];

  return (
    <React.Fragment>
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
   </React.Fragment>
  )
}

export default App
