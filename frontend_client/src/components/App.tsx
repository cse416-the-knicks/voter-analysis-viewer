import L, { FeatureGroup, type LeafletMouseEvent, type PathOptions, type StyleFunction } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import { GeoJSON } from 'react-leaflet';
import type { MapRef } from 'react-leaflet/MapContainer';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import './App.css';
//import { statesData } from '../helpers/TestChoroplethData';

import type { GradientMap } from "../helpers/GradientMap";
import { gradientMapNearest } from "../helpers/GradientMap";

import NotFoundPage from "./NotFoundPage";
import BackgroundBlurrer from "./BackgroundBlurrer";
import FullBoundedUSMap from './FullBoundedUSMap/';
import type { FipsCode } from './FullBoundedUSMap/';

import StateInformationView from './StateInformationView';

// For the background overlay system
const CHOROPLETH_COLOR_MAP: GradientMap  = {
  1000:'#800026',
  500: '#BD0026',
  200: '#E31A1C',
  100: '#FC4E2A',
  50:  '#FD8D3C',
  20:  '#FEB24C',
  10:  '#FED976',
  0:   '#FFEDA0',
};

function geoJsonFeatureColorStyle(gradientMap: GradientMap): StyleFunction {
  return function(feature: GeoJSON.Feature | undefined): PathOptions {
    return {
      fillColor: gradientMapNearest(feature?.properties?.density ?? 0, gradientMap),
      weight: 1,
      opacity: 1,
      color: 'black',
      dashArray: '2',
      fillOpacity: 0.75
    };
  }
}

interface MapLegendParameters {
  leafletMap: React.RefObject<MapRef>,
  gradientMap: GradientMap,
}
function MapChoroplethLegend({ leafletMap , gradientMap } : MapLegendParameters) {
  /*
     NOTE(jerry):
     Adapted slightly from the official leaflet example for
     how to draw a choropleth map.
  */
  useEffect(
    function() {
      const mapState = leafletMap.current;
      if (mapState) {
        const legend = new L.Control({position: 'bottomright'});
        legend.onAdd = function () {
          const div = L.DomUtil.create('div', 'info legend');
          const grades = Object.keys(CHOROPLETH_COLOR_MAP).map(Number);

          for (let i = 0; i < grades.length; i++) {
            const color = gradientMapNearest(grades[i], gradientMap);
            div.innerHTML +=
              '<i style="background:' + color + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }

          return div;
        };

        legend.addTo(mapState);
      }
    },
    [leafletMap, gradientMap])
  return null;
}

interface MainScreenMapParameters {
  leafletMap : React.RefObject<MapRef>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data : any, // The type is very complicated to annotate here.
};

/**
 * This is the map used for the landing / splash page of the viewer.
 * 
 * Submaps will be defined as separate components.
 */
function MainScreenMap({ leafletMap, data } : MainScreenMapParameters) {
  const navigate = useNavigate();
  const location = useLocation();

  function onFeatureClickHandler (event: LeafletMouseEvent) {
    const target = event.target as FeatureGroup;
    const featureData = target.feature as GeoJSON.Feature;

    if (featureData.properties) {
      navigate(
        `/state/${featureData.properties.name}`,
        {
          state: { backgroundLocation: location }
        });
    }

    // Zoom into map.
    const mapState = leafletMap.current;
    mapState?.fitBounds(target.getBounds());
  }

  function onEachFeatureHandler(_feature: GeoJSON.Feature, layer: L.Layer) {
    layer.on({
      click: onFeatureClickHandler
    });
  }

  return (
    <React.Fragment>
        <GeoJSON 
        style={geoJsonFeatureColorStyle(CHOROPLETH_COLOR_MAP)}
        data={data as GeoJSON.GeoJSON}
        onEachFeature={onEachFeatureHandler}/>
        <MapChoroplethLegend leafletMap={leafletMap} gradientMap={CHOROPLETH_COLOR_MAP}/>
    </React.Fragment>
  );
}

function LandingPage() {
  const mapState = useRef<MapRef>(null);
  const navigate = useNavigate();

  const onStateClick = (fipsCode: FipsCode) => {
    navigate(`/state/${fipsCode}`);
  }

  return (
    <React.Fragment>
      <FullBoundedUSMap
	mapRef={mapState}
	id="main-map"
	onStateClick={onStateClick}>
      </FullBoundedUSMap>
    </React.Fragment>
  );
}

function App() {
  const stateUrlMatcher = "/state/:fipsCode/*";
  return (
    <React.Fragment>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path={stateUrlMatcher}element={<LandingPage/>}/>
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
