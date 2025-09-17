import './App.css';
import './voterAPI.tsx';
import 'leaflet/dist/leaflet.css';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { getTestEndpoint } from './voterAPI.tsx';
import { statesData } from './TestChoroplethData';
import L, { FeatureGroup, type LeafletMouseEvent, type PathOptions, type StyleFunction } from 'leaflet';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { MapRef } from 'react-leaflet/MapContainer';

interface GradientMap {
  [key: number]: string
};

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

// NOTE(jerry):
// These boundaries were given by ChatGPT
// although they can be googled from some Medium posts
// as well.
const UNITED_STATES_BOUNDARIES : L.LatLngTuple[] = [
  [24.396308, -125.0], // Southwest Corner
  [49.384358, -66.93457] // Northeast Corner
];

function getColorFromGradient(x: number, gradientBreakpoints: GradientMap): string {
  let i = 0;
  const breakpoints = Object.keys(gradientBreakpoints).map(Number);
  const colors = Object.values(gradientBreakpoints);
  let result = colors[i];

  for (i = 0; i < breakpoints.length; ++i) {
    if (x >= breakpoints[i]) {
      result = colors[i];
    }
  }

  return result;
}

function geoJsonFeatureColorStyle(gradientMap: GradientMap): StyleFunction {
  return function(feature: GeoJSON.Feature | undefined): PathOptions {
    return {
      fillColor: getColorFromGradient(feature?.properties?.density ?? 0, gradientMap),
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
            const color = getColorFromGradient(grades[i], gradientMap);
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
  data : any, // The type is very complicated to annotate here.
};

/**
 * This is the map used for the landing / splash page of the viewer.
 * 
 * Submaps will be defined as separate components.
 */
function MainScreenMap({ leafletMap, data } : MainScreenMapParameters) {
  function onFeatureClickHandler (event: LeafletMouseEvent) {
    const target = event.target as FeatureGroup;
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

function App() {
  const mapState = useRef<MapRef>(null);
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    getTestEndpoint()
    .then(function (res) {
      setBackendMessage(res.data);
    })
    .catch(function (err) {
      console.error("Error connecting to backend: ", err)
    });
  }, []);

  return (
    <React.Fragment>
      <h2>Backend says: {backendMessage}</h2>
      <MapContainer
        zoom={4}
        bounds={UNITED_STATES_BOUNDARIES}
        maxBounds={UNITED_STATES_BOUNDARIES}
        maxBoundsViscosity={1.0}
        ref={mapState}
        id="main-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MainScreenMap
          leafletMap={mapState}
          data={statesData as GeoJSON.GeoJSON}/>
      </MapContainer>
    </React.Fragment>
  )
}

export default App