import './App.css'
import 'leaflet/dist/leaflet.css'
import './voterAPI.tsx'
import { getTestEndpoint } from './voterAPI.tsx'
import { statesData } from './TestChoroplethData';
import { GeoJSON, MapContainer, TileLayer, useMap, Marker, Popup} from 'react-leaflet'
import React from 'react'
import { useState, useEffect, use } from 'react'

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
const UNITED_STATES_BOUNDARIES = [
  [24.396308, -125.0], // Southwest Corner
  [49.384358, -66.93457] // Northeast Corner
];

function getColorFromGradient(x: number, gradientBreakpoints: GradientMap): string {
  let i = 0;
  const breakpoints = Object.keys(gradientBreakpoints);
  const colors = Object.values(gradientBreakpoints);
  let result = colors[i];

  for (i = 0; i < breakpoints.length; ++i) {
    if (x >= breakpoints[i]) {
      result = colors[i];
    }
  }

  return result;
}

function geoJsonFeatureColorStyle(gradientMap: GradientMap) {
  return function(feature) {
    return {
      fillColor: getColorFromGradient(feature.properties.density, gradientMap),
      weight: 1,
      opacity: 1,
      color: 'black',
      dashArray: '2',
      fillOpacity: 0.75
    };
  }
}

function MapLegend({ leafletMap, gradientMap }) {
  /*
     NOTE(jerry):
     Adapted slightly from the official leaflet example for
     how to draw a choropleth map.
  */
  useEffect(
    function() {
      if (leafletMap) {
        const legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {
          const div = L.DomUtil.create('div', 'info legend');
          const grades = Object.keys(CHOROPLETH_COLOR_MAP);
          const labels = [];

          for (let i = 0; i < grades.length; i++) {
            const color = getColorFromGradient(parseInt(grades[i]), gradientMap);
            console.log(color)
            div.innerHTML +=
              '<i style="background:' + color + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }

          return div;
        };

        legend.addTo(leafletMap);
      }
    },
    [leafletMap, gradientMap])
  return null;
}

function App() {
  const [mapState, setMapState] = useState(null);
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
        ref={setMapState}
        id="main-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON style={geoJsonFeatureColorStyle(CHOROPLETH_COLOR_MAP)} data={statesData}/>
        <MapLegend leafletMap={mapState} gradientMap={CHOROPLETH_COLOR_MAP}/>
      </MapContainer>
    </React.Fragment>
  )
}

export default App
