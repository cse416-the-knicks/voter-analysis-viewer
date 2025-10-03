import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Route, Routes, useLocation } from 'react-router';
import './App.css';

import NotFoundPage from "./NotFoundPage";
import BackgroundBlur from "./BackgroundBlur";

import StateInformationView from './StateInformationView';
import DisplayVotingMachineSummaryView from './DisplayVotingMachineSummaryView';
import FrontPage from './FrontPage';
import PartyTablePage from './FrontPage/PartyTablePage';

function App() {
  const stateUrlMatcher = "/state/:fipsCode/*";
  const displayVotingMachineSummaryMatcher = "/display/voting-machine-summary";
  const location = useLocation();
  const showBlocker = location.pathname !== "/";

  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<FrontPage/>}/>
        <Route path={stateUrlMatcher}element={<FrontPage/>}/>
        <Route path={displayVotingMachineSummaryMatcher}element={<FrontPage/>}/>
        {/* Temporary navigation to handle GUI-15, still need to figure out how to integrate into main front page */}
        <Route path="/compare/partystates" element={<PartyTablePage />}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
      {/* TODO(jerry): This is wrong, should be state flag. */}
      <BackgroundBlur showBlocker={showBlocker}/>
      {/* NOTE(jerry): Needed in order to do the overlay effect that I think looks cool. */}
      <Routes>
        <Route path={stateUrlMatcher}element={<StateInformationView/>}/>
        <Route path={displayVotingMachineSummaryMatcher}element={<DisplayVotingMachineSummaryView/>}/>
        <Route path="*" element={<React.Fragment/>}/>
      </Routes> 
   </React.Fragment>
  )
}

export default App
