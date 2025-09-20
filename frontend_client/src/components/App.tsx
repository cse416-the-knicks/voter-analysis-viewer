import 'leaflet/dist/leaflet.css';
import React from 'react';
import { Route, Routes } from 'react-router';
import './App.css';

import NotFoundPage from "./NotFoundPage";
import BackgroundBlurrer from "./BackgroundBlurrer";

import StateInformationView from './StateInformationView';
import FrontPage from './FrontPage';

function App() {
  const stateUrlMatcher = "/state/:fipsCode/*";
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<FrontPage/>}/>
        <Route path={stateUrlMatcher}element={<FrontPage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
      {/* TODO(jerry): This is wrong, should be state flag. */}
      <Routes>
        <Route path={stateUrlMatcher}element={<BackgroundBlurrer/>}/>
        <Route path="*" element={<React.Fragment/>}/>
      </Routes>
      {/* NOTE(jerry): Needed in order to do the overlay effect that I think looks cool. */}
      <Routes>
        <Route path={stateUrlMatcher}element={<StateInformationView/>}/>
        <Route path="*" element={<React.Fragment/>}/>
      </Routes> 
   </React.Fragment>
  )
}

export default App
