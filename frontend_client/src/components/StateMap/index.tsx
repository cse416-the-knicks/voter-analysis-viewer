/**
  This will require a client connection to the backend.
**/
import {useEffect, useState} from 'react';
import L from 'leaflet';
import type { MapRef } from 'react-leaflet/MapContainer';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';;

import { getStateGeometry } from '../../api/client';

interface StateMapParameters {
  fipsCode?: string,
  mapRef?: React.RefObject<MapRef>;
}

function StateMap(
  {
    fipsCode,
    mapRef,
  } : StateMapParameters) {
  const [stateGeoJson, setStateGeoJson] = useState<GeoJSON.GeoJSON | null>(null);
  const [readyToDisplay, setReadyToDisplay] = useState(false);
  const [stateMapBounds, setStateMapBounds] = useState<L.LatLngBoundsExpression | null>();

  useEffect(
    function() {
      (async function() {
	if (!fipsCode) {
	  return;
	}

	const response = await getStateGeometry(fipsCode);
	if (response) {
	  setStateGeoJson(response as GeoJSON.GeoJSON);
	  setStateMapBounds(
	    [
	      [response.bbox![1], response.bbox![0]],
	      [response.bbox![3], response.bbox![2]],
	    ]
	  );
	  setReadyToDisplay(true);
	}
      })();
    }, []);

  if (!fipsCode) {
    return (
      <p>No FIPS code for state. No map!</p>
    );
  }

  if (readyToDisplay) {
    return (
      <MapContainer
	ref={mapRef}
	bounds={stateMapBounds!}
	maxBounds={stateMapBounds!}
	style={
	  {
	    width: "500px",
	    height: "400px",
	  }
	}
      >
	<TileLayer
	  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
	/>
	<GeoJSON
	  data={stateGeoJson!}
	/>
      </MapContainer>
    )
  } else {
    return (
      <>
	<p>Loading map...</p>
      </>
    );
  }
}

export type {
  StateMapParameters
};

export default StateMap;
